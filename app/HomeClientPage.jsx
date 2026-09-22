'use client';
import Home from '../src/views/Home';
import { useGlobalState } from '../src/context/GlobalStateContext';
import { useRouter } from 'next/navigation';

export default function HomeClientPage({ initialCourses, initialBundles }) {
  const { currentLang, setTrialModalOpen } = useGlobalState();
  const router = useRouter();
  
  const setActiveTab = (tab) => {
    if (tab === 'home') router.push('/');
    else router.push('/' + tab);
  };

  return (
    <Home 
      currentLang={currentLang} 
      setActiveTab={setActiveTab} 
      onOpenTrialModal={() => setTrialModalOpen(true)} 
      initialCourses={initialCourses}
      initialBundles={initialBundles}
    />
  );
}