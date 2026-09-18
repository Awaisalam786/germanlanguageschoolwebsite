import { supabase } from '../../src/lib/supabaseClient';
import GalleryClientPage from './GalleryClientPage';

export const revalidate = 60;

export default async function GalleryPage() {
  const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  let mapped = [];
  if (data) {
    mapped = data.map(item => ({
      id: item.id,
      category: 'Live Classes', 
      imageUrl: item.url,
      alt: 'German Learning School class',
      title: 'Live Zoom Session'
    }));
  }
  return <GalleryClientPage initialGallery={mapped} />;
}