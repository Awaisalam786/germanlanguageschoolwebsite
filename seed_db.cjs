const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://qhdftblxajrwbssfibff.supabase.co', 'sb_publishable_4ImDaLDvG0I6JJSmyzp-Eg_ZycX1rW6');

const initialCourses = [
  { level: 'A1', title: 'Beginner Foundation', duration: '8 Weeks (80 Hours)', price: '€390', schedule: 'Flexible Live Batches Available' },
  { level: 'A2', title: 'Elementary', duration: '8 Weeks (80 Hours)', price: '€490', schedule: 'Flexible Live Batches Available' },
  { level: 'B1', title: 'Intermediate (Goethe Prep)', duration: '8 Weeks (80 Hours)', price: '€590', schedule: 'Flexible Live Batches Available' },
  { level: 'B2', title: 'Upper Intermediate', duration: '12 Weeks (120 Hours)', price: '€690', schedule: 'Flexible Live Batches Available' }
];

const mockTestimonials = [
  { name: 'Ali Hassan', course: 'B1 Intensive', rating: 5, text: 'Cleared my exam with 92 marks! Highly recommended.', type: 'text' },
  { name: 'Sara Khan', course: 'A2 Foundation', rating: 5, text: 'Best online German classes in Pakistan.', type: 'text' }
];

async function seed() {
  console.log('Seeding courses...');
  await supabase.from('courses').insert(initialCourses);
  
  console.log('Seeding testimonials...');
  await supabase.from('testimonials').insert(mockTestimonials);
  
  console.log('Done!');
}

seed();
