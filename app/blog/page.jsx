'use client';
import Blog from '../../src/views/Blog';
import { useGlobalState } from '../../src/context/GlobalStateContext';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const { currentLang, setTrialModalOpen } = useGlobalState();
  const router = useRouter();
  
  const setActiveTab = (tab) => {
    if (tab === 'home') router.push('/');
    else router.push('/' + tab);
  };

  return (
    <Blog 
      currentLang={currentLang} 
      setActiveTab={setActiveTab} 
      onOpenTrialModal={() => setTrialModalOpen(true)} 
    />
  );
}
