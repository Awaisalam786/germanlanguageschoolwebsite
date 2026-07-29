'use client';
import Gallery from '../../src/views/Gallery';
import { useGlobalState } from '../../src/context/GlobalStateContext';
import { useRouter } from 'next/navigation';

export default function GalleryPage() {
  const { currentLang, setTrialModalOpen } = useGlobalState();
  const router = useRouter();
  
  const setActiveTab = (tab) => {
    if (tab === 'home') router.push('/');
    else router.push('/' + tab);
  };

  return (
    <Gallery 
      currentLang={currentLang} 
      setActiveTab={setActiveTab} 
      onOpenTrialModal={() => setTrialModalOpen(true)} 
    />
  );
}
