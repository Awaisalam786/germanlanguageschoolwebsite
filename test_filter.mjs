import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data } = await supabase.from('vocab_chapters').select('id, level, chapter_number, json_data').eq('level', 'A1').eq('chapter_number', 1);
  let chapters = data;
  
  let combined = [];
  chapters.forEach(chap => {
    let parsedData = chap.json_data || [];
    if (typeof parsedData === 'string') {
      try { parsedData = JSON.parse(parsedData); } catch (e) { parsedData = []; }
    }
    if (!Array.isArray(parsedData)) {
      parsedData = [parsedData];
    }
    
    // Normalize legacy nested schema
    parsedData = parsedData.map(word => {
      if (!word || typeof word !== 'object') return word;
      const normalized = { ...word };
      
      if (word.german && typeof word.german === 'object') {
        normalized.german = word.german.word || word.german.primary || '';
        normalized.accepted_german_answers = word.german.accepted_german_answers || word.german.accepted || [];
      }
      if (word.english && typeof word.english === 'object') {
        normalized.english = word.english.word || word.english.primary || '';
        normalized.accepted_answers = word.english.accepted_english_answers || word.english.accepted || [];
      }
      return normalized;
    });

    combined = combined.concat(parsedData);
  });

  combined = combined.filter(q => q && typeof q === 'object' && typeof q.german === 'string' && q.german.trim() !== '' && typeof q.english === 'string' && q.english.trim() !== '');
  
  console.log("Combined length after filter:", combined.length);
  if (combined.length === 0) {
     console.log("Here is what parsedData looked like:");
     let parsed = chapters[0].json_data;
     if (typeof parsed === 'string') parsed = JSON.parse(parsed);
     console.log(JSON.stringify(parsed.slice(0, 2), null, 2));
  }
}
run();
