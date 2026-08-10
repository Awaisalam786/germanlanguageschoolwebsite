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

async function runUpdate() {
  const { data, error } = await supabase
    .from('practice_materials')
    .update({ test_type: 'Vocab Test' })
    .in('test_type', ['Grammar / Vocab', 'Full Exam', 'Grammar', 'Vocab'])
    .select('id, title, level, test_type');

  if (error) {
    console.error('Update failed:', error);
    return;
  }

  console.log(`Successfully updated ${data.length} tests to "Vocab Test".`);
  console.log('Updated Tests:', data);
}

runUpdate();
