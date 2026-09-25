// Sample profiles from supabase/seed_data.sql (fictional names, invented
// credentials, Unsplash stock photos). They are still present in the live
// `teachers` table, so they are filtered out before rendering — on the server
// (so they are not even serialized into the page HTML) and in the client view.
// Delete them in Admin -> Teachers; this list can then be removed.
export const SAMPLE_TEACHER_NAMES = new Set([
  'Prof. Dr. Michael Weber',
  'Miss Fatima Noor',
  'Sir Ahmed Shah',
]);

export const withoutSampleTeachers = (list) =>
  (list || []).filter((t) => !SAMPLE_TEACHER_NAMES.has((t?.name || '').trim()));

// Sample testimonials inserted by supabase/seed_data.sql (fictional students,
// one crediting the fictional "Dr. Weber"). They are still in the live table,
// so they are filtered out by id. Delete them in Admin -> Testimonials; this
// list can then be removed.
export const SAMPLE_TESTIMONIAL_IDS = new Set([
  '2bafa78f-2671-4116-acc8-82111ceeddff',
  '652ff668-bbee-4a94-87dc-115b0604a339',
  '60358066-4de0-4882-a8f4-0484c081bf0e',
]);

export const withoutSampleTestimonials = (list) =>
  (list || []).filter((t) => !SAMPLE_TESTIMONIAL_IDS.has(t?.id));
