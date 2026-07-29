'use client';
import Translator from '../../src/views/Translator';
import { useGlobalState } from '../../src/context/GlobalStateContext';
import { useRouter } from 'next/navigation';

export default function TranslatorPage() {
  const { currentLang, setTrialModalOpen } = useGlobalState();
  const router = useRouter();
  
  const setActiveTab = (tab) => {
    if (tab === 'home') router.push('/');
    else router.push('/' + tab);
  };

  return (
    <Translator 
      currentLang={currentLang} 
      setActiveTab={setActiveTab} 
      onOpenTrialModal={() => setTrialModalOpen(true)} 
    />
  );
}
