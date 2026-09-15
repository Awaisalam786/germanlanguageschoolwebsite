'use client';
import FAQ from '../../src/views/FAQ';
import { useGlobalState } from '../../src/context/GlobalStateContext';
import { useRouter } from 'next/navigation';
import { initialFaqs } from '../../src/mockData/seedData';
import SchemaMarkup from '../../src/components/SchemaMarkup';

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": initialFaqs.map((faq) => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
};

export default function FAQPage() {
  const { currentLang, setTrialModalOpen } = useGlobalState();
  const router = useRouter();

  const setActiveTab = (tab) => {
    if (tab === 'home') router.push('/');
    else router.push('/' + tab);
  };

  return (
    <>
      <SchemaMarkup schema={faqPageSchema} />
      <FAQ
        currentLang={currentLang}
        setActiveTab={setActiveTab}
        onOpenTrialModal={() => setTrialModalOpen(true)}
      />
    </>
  );
}
