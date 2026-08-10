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

async function checkTests() {
  const { data, error, count } = await supabase
    .from('practice_materials')
    .select('id, title, test_type', { count: 'exact' })
    .in('test_type', ['Grammar / Vocab', 'Full Exam', 'Grammar', 'Vocab']);

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${count} tests that match the criteria to be updated.`);
  console.log(data);
}

checkTests();
