'use client';
import HowOnlineWorks from '../../src/views/HowOnlineWorks';
import { useGlobalState } from '../../src/context/GlobalStateContext';
import { useRouter } from 'next/navigation';

export default function HowOnlineWorksPage() {
  const { currentLang, setTrialModalOpen } = useGlobalState();
  const router = useRouter();
  
  const setActiveTab = (tab) => {
    if (tab === 'home') router.push('/');
    else router.push('/' + tab);
  };

  return (
    <HowOnlineWorks 
      currentLang={currentLang} 
      setActiveTab={setActiveTab} 
      onOpenTrialModal={() => setTrialModalOpen(true)} 
    />
  );
}
