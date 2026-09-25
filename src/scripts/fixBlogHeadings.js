// One-off content fix: promote section titles that were saved as plain
// paragraphs (<p>) in five existing blog posts to real <h2>/<h3> headings.
//
// The posts were pasted into the editor, so their section titles lost their
// heading formatting. The heading texts below are copied verbatim from the
// published articles; nothing is added, removed or reworded. Only the tag
// changes (and non-breaking spaces inside those titles become normal spaces
// so the headings can wrap on mobile).
//
// Usage (from the project root, needs .env with Supabase + system account):
//   node src/scripts/fixBlogHeadings.js           -> dry run, shows changes
//   node src/scripts/fixBlogHeadings.js --apply   -> writes to Supabase
//
// Safe to re-run: headings that were already converted are skipped, and the
// script refuses to write a post if any expected title is not found exactly
// once.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

export const HEADING_PLAN = {
  'telc-b2-medizin-the-medical-german-exam-pakistani-doctors-and-nurses-need-for-germany': [
    ['h2', 'Why doctors and nurses need a different German exam'],
    ['h2', 'What the exam actually covers'],
    ['h2', 'How it fits into Approbation'],
    ['h2', 'For nurses'],
    ['h2', 'What to actually do'],
  ],
  'goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam': [
    ['h2', 'Why does the exam you pick even matter?'],
    ['h2', 'Goethe-Zertifikat'],
    ['h2', 'telc (The European Language Certificates)'],
    ['h2', 'TestDaF'],
    ['h2', 'ÖSD (Österreichisches Sprachdiplom Deutsch)'],
    ['h2', 'So which one should you actually take?'],
  ],
  'goethe-vs-telc-which-german-exam-should-you-choose-in-pakistan': [
    ['h2', 'Short answer: it depends on who\'s asking for the certificate, not which exam is "better"'],
    ['h2', 'What Goethe-Institut is'],
    ['h2', 'What telc is'],
    ['h2', 'So which one should you actually pick?'],
    ['h2', 'The one thing not to do'],
  ],
  'how-to-choose-the-best-german-language-school-in-pakistan-a-checklist': [
    ['h2', 'There\'s no official ranking, so here\'s what to actually check instead'],
    // The six checklist questions sit under the section above.
    ['h3', 'Is the instructor actually qualified, and can you verify it?'],
    ['h3', 'Does the course follow a real CEFR structure (A1 to B2), or is it a vague "conversational German" class?'],
    ['h3', 'Are classes live and interactive, or pre-recorded videos with no speaking practice?'],
    ['h3', 'Do they have a track record of students actually passing Goethe or telc exams?'],
    ['h3', 'Is the fee structure and batch schedule transparent upfront?'],
    ['h3', 'Do they offer exam-specific preparation, not just general German lessons?'],
    ['h2', 'What this means for evaluating us, or anyone else'],
  ],
  'documents-required-for-a-germany-student-work-visa-from-pakistan-complete-checklist': [
    ['h2', 'One important caveat before the checklist'],
    ['h2', 'The core documents almost every applicant needs'],
    ['h2', 'Additional documents specific to students'],
    ['h2', 'Additional documents specific to work/Ausbildung applicants'],
    ['h2', 'What actually causes delays (from what we see with our own students)'],
  ],
};

const decodeEntities = (s) =>
  s
    .replace(/&nbsp;|&#160;|\u00a0/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&apos;|&rsquo;|&#8217;|\u2019/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const plainText = (html) =>
  decodeEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

// Returns { html, changes, errors } without touching the database.
export function convertHeadings(html, plan) {
  let out = html;
  const changes = [];
  const errors = [];

  for (const [tag, text] of plan) {
    const target = plainText(text);

    // Already converted on a previous run?
    const existing = [...out.matchAll(/<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi)]
      .filter((m) => plainText(m[3]) === target);
    if (existing.length > 0) {
      changes.push({ tag, text, status: 'already-heading' });
      continue;
    }

    const matches = [...out.matchAll(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi)]
      .filter((m) => plainText(m[2]) === target);

    if (matches.length !== 1) {
      errors.push(`"${text}" matched ${matches.length} paragraph(s), expected exactly 1`);
      continue;
    }

    const [full, , inner] = matches[0];
    const cleanInner = inner.replace(/&nbsp;|&#160;|\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    // Function replacer so `$` sequences in the text are never treated as patterns.
    out = out.replace(full, () => `<${tag}>${cleanInner}</${tag}>`);
    changes.push({ tag, text, status: 'converted' });
  }

  return { html: out, changes, errors };
}

function loadEnv() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(__dirname, '../../.env');
  const env = {};
  fs.readFileSync(envPath, 'utf-8').split(/\r?\n/).forEach((line) => {
    const [key, ...value] = line.split('=');
    if (key && value.length) env[key.trim()] = value.join('=').trim().replace(/^['"]|['"]$/g, '');
  });
  return env;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (apply) {
    // Same system account the admin panel uses (RLS: authenticated can write blog_posts).
    const { error } = await supabase.auth.signInWithPassword({
      email: env.SYSTEM_SUPABASE_EMAIL,
      password: env.SYSTEM_SUPABASE_PASSWORD,
    });
    if (error) throw new Error(`System sign-in failed: ${error.message}`);
  }

  let failed = false;
  for (const [slug, plan] of Object.entries(HEADING_PLAN)) {
    const { data: post, error } = await supabase
      .from('blog_posts').select('id, slug, content').eq('slug', slug).single();
    if (error || !post) {
      console.error(`✗ ${slug}: not found (${error?.message || 'no row'})`);
      failed = true;
      continue;
    }

    const result = convertHeadings(post.content, plan);
    console.log(`\n${slug}`);
    result.changes.forEach((c) => console.log(`  ${c.status === 'converted' ? '+' : '='} <${c.tag}> ${c.text}`));
    result.errors.forEach((e) => console.log(`  ✗ ${e}`));

    if (result.errors.length) {
      failed = true;
      console.log('  -> skipped (not all titles matched exactly once)');
      continue;
    }
    if (result.html === post.content) {
      console.log('  -> nothing to change');
      continue;
    }
    if (!apply) {
      console.log('  -> dry run, not saved');
      continue;
    }

    const { error: updateError } = await supabase
      .from('blog_posts').update({ content: result.html }).eq('id', post.id);
    if (updateError) {
      console.error(`  ✗ update failed: ${updateError.message}`);
      failed = true;
    } else {
      console.log('  -> saved');
    }
  }

  if (!apply) console.log('\nDry run only. Re-run with --apply to save.');
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
