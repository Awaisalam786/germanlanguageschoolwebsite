import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
  const { data, error } = await supabase
    .from('practice_materials')
    .select('title, file_url')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    return;
  }

  console.log('Found tests:', data.length);
  for (let i = 0; i < data.length; i++) {
    console.log(`Fetching ${data[i].title}... URL: ${data[i].file_url}`);
    if (data[i].file_url) {
      try {
        const res = await fetch(data[i].file_url);
        const html = await res.text();
        fs.writeFileSync(`test_${i}.html`, html);
        console.log(`Saved test_${i}.html - Length: ${html.length}`);
      } catch (e) {
        console.log(`Failed to fetch ${data[i].file_url}`);
      }
    }
  }
}

inspect();
