import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Compass, 
  FileText, 
  GraduationCap, 
  Headphones, 
  HelpCircle, 
  Languages, 
  MessageSquare, 
  PenTool, 
  Sparkles, 
  Calendar, 
  Users, 
  Award,
  Layers
} from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';

export const metadata = {
  title: {
    absolute: 'German A1 Syllabus: Complete Beginner Course Guide | German Learning School',
  },
  description: 'Explore the complete German A1 syllabus including grammar, vocabulary, speaking, listening, reading, writing, and exam preparation. Start learning German A1 online.',
  alternates: {
    canonical: '/german-a1-syllabus',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  openGraph: {
    title: 'German A1 Syllabus: Complete Beginner Course Guide | German Learning School',
    description: 'Explore the complete German A1 syllabus including grammar, vocabulary, speaking, listening, reading, writing, and exam preparation. Start learning German A1 online.',
    url: 'https://germanlearningschool.com/german-a1-syllabus',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German A1 Syllabus: Complete Beginner Course Guide | German Learning School',
    description: 'Explore the complete German A1 syllabus including grammar, vocabulary, speaking, listening, reading, writing, and exam preparation. Start learning German A1 online.',
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
    { "@type": "ListItem", "position": 2, "name": "German A1 Syllabus", "item": "https://germanlearningschool.com/german-a1-syllabus" }
  ]
};

const faqs = [
  {
    q: 'What is the German A1 syllabus?',
    a: 'The German A1 syllabus is the standardized beginner curriculum aligned with the Common European Framework of Reference for Languages (CEFR). It outlines the foundational grammar topics, core vocabulary domains (500–800 words), everyday conversational scenarios, and language competencies (reading, listening, writing, speaking) required to communicate at a basic level.'
  },
  {
    q: 'What topics are included in the German A1 level?',
    a: 'German A1 covers practical everyday topics such as self-introductions, personal information, family members, housing and furniture, food and drinks, grocery shopping, professions, daily routines, telling time, transportation, weather, and free-time hobbies.'
  },
  {
    q: 'How long does German A1 take to complete?',
    a: 'Under guided instruction with live classes, German A1 typically requires between 60 and 80 guided learning hours, usually completed over 6 to 8 weeks in an intensive or semi-intensive format, supplemented by daily vocabulary practice.'
  },
  {
    q: 'What grammar is covered in German A1?',
    a: 'Key A1 German grammar includes personal pronouns, regular and irregular verb conjugation in the present tense (Präsens), sein and haben, modal verbs, noun genders (der, die, das), the Nominative and Accusative cases, negation with nicht and kein, W-questions, yes/no questions, basic prepositions, sentence word order (Satzbau), possessive determiners, plural forms, imperative commands, and a foundational introduction to the conversational past tense (Perfekt).'
  },
  {
    q: 'What vocabulary is covered in German A1?',
    a: 'A1 vocabulary focuses on high-frequency everyday words: numbers (1–1,000), calendar days, months, clock times, family relationships, food items, clothing, directions, household items, colors, basic adjectives, and common verbs needed for routine transactions.'
  },
  {
    q: 'Is A1 enough for basic conversation in Germany?',
    a: 'Yes, German A1 equips you to handle simple everyday interactions such as greeting people, asking and answering questions about personal details, ordering food in restaurants, purchasing train tickets, asking for directions, and making simple requests.'
  },
  {
    q: 'What exam can be taken after German A1?',
    a: 'After completing the A1 syllabus, learners can sit for official standardized examinations such as the Goethe-Zertifikat A1: Start Deutsch 1 or the telc Deutsch A1. These certifications are formally recognized for German Spouse / Family Reunion Visas (Ehegattennachzug) and Au Pair applications.'
  },
  {
    q: 'How can someone prepare for German A1 effectively?',
    a: 'Effective A1 preparation combines structured live interactive classes with consistent daily practice. Study nouns with their definite articles from day one, complete reading and listening comprehension exercises, practice spoken dialogues with a partner, and test your progress with free online German A1 practice tests.'
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
};

const grammarModules = [
  {
    title: 'Personal Pronouns',
    desc: 'Mastering subject pronouns across singular and plural: ich, du, er, sie, es, wir, ihr, sie, and formal Sie.'
  },
  {
    title: 'Present Tense (Präsens)',
    desc: 'Regular verb conjugation patterns (-e, -st, -t, -en, -t, -en) and stem-vowel changes in common verbs.'
  },
  {
    title: 'sein & haben',
    desc: 'Full conjugation and everyday usage of the two most essential auxiliary verbs in the German language.'
  },
  {
    title: 'Regular & Irregular Verbs',
    desc: 'Conjugating high-frequency strong verbs with vowel shifts (e→i, e→ie, a→ä) such as sprechen, lesen, and fahren.'
  },
  {
    title: 'Modal Verbs',
    desc: 'Usage, meaning, and sentence bracket construction for können (can), müssen (must), möchten/wollen (want), dürfen (may), and sollen (should).'
  },
  {
    title: 'Articles: der, die, das',
    desc: 'Definite articles (der, die, das), indefinite articles (ein, eine), and negative articles (kein, keine).'
  },
  {
    title: 'Nominative Case (Nominativ)',
    desc: 'Identifying the grammatical subject performing the action and predicate nouns with sein/werden.'
  },
  {
    title: 'Accusative Case (Akkusativ)',
    desc: 'Direct objects and the crucial masculine article shift: der → den, ein → einen, kein → keinen.'
  },
  {
    title: 'Negation: nicht vs. kein',
    desc: 'Rules for negating verbs, adjectives, and definite nouns with nicht versus negating indefinite/unarticled nouns with kein.'
  },
  {
    title: 'W-Fragen (Open Questions)',
    desc: 'Forming interrogatives with question words: Wer (who), Was (what), Wo (where), Wohin (where to), Woher (where from), Wann (when), Wie (how), Warum (why).'
  },
  {
    title: 'Ja/Nein Questions',
    desc: 'Inversion sentence structure placing the conjugated verb into position 1 for closed questions.'
  },
  {
    title: 'Satzbau & Word Order',
    desc: 'The fundamental golden rule of German syntax: the conjugated verb must always occupy Position 2 in declarative main clauses.'
  },
  {
    title: 'Possessive Articles',
    desc: 'Expressing ownership with mein (my), dein (your), sein (his), ihr (her/their), unser (our), euer (your pl.), and Ihr (formal your).'
  },
  {
    title: 'Plural Forms',
    desc: 'The five common plural endings (-e, -er, -en/-n, -s, no ending) along with frequent stem umlaut additions.'
  },
  {
    title: 'Basic Prepositions',
    desc: 'Spatial and temporal prepositions: in, aus, nach, zu, an, mit, and für.'
  },
  {
    title: 'Imperativ (Commands)',
    desc: 'Constructing polite formal commands (Sie), informal singular commands (du), and group suggestions (wir).'
  },
  {
    title: 'Introduction to Perfekt',
    desc: 'Basics of spoken past tense using haben/sein auxiliary verbs alongside regular Partizip II (ge-...-t).'
  }
];

const vocabCategories = [
  { name: 'Greetings & Goodbyes', examples: 'Hallo, Guten Morgen, Auf Wiedersehen, Tschüss, Bis bald' },
  { name: 'Numbers & Quantities', examples: 'Cardinal numbers 1–1,000, telephone numbers, counting, prices in Euro/PKR' },
  { name: 'Calendar & Time', examples: 'Days of the week, months, seasons, telling the clock time (offiziell & inoffiziell)' },
  { name: 'Family & Relations', examples: 'Eltern, Mutter, Vater, Sohn, Tochter, Bruder, Schwester, verheiratet, ledig' },
  { name: 'Personal Information', examples: 'Name, Alter, Herkunft, Wohnort, Beruf, Sprachen, Nationalität, Adresse' },
  { name: 'Housing & Home', examples: 'Wohnung, Zimmer, Küche, Bad, Möbel, Tisch, Stuhl, Bett, Miete, Balkon' },
  { name: 'Food & Drinks', examples: 'Brot, Wasser, Kaffee, Tee, Fleisch, Gemüse, Obst, Frühstück, Mittagessen' },
  { name: 'Shopping & Supermarket', examples: 'Supermarkt, einkaufen, wie viel kostet, billig, teuer, Kasse, Euro, Cent' },
  { name: 'Work & Professions', examples: 'Arzt, Lehrer, Ingenieur, Büro, Kollege, Arbeitsplatz, Student, arbeiten' },
  { name: 'School & Languages', examples: 'Deutsch lernen, Kurs, Schule, Buch, schreiben, sprechen, verstehen' },
  { name: 'Daily Routines', examples: 'aufstehen, frühstücken, zur Arbeit gehen, schlafen, anrufen, fernsehen' },
  { name: 'Transport & Directions', examples: 'Zug, Bus, Bahnhof, Flughafen, Ticket, rechts, links, geradeaus' },
  { name: 'Health & Well-being', examples: 'Kopfschmerzen, Arzttermin, Praxis, Apotheke, Medikamente, krank, gesund' },
  { name: 'Weather & Climate', examples: 'Sonne, Regen, Schnee, warm, kalt, windig, Wetterbericht' },
  { name: 'Hobbies & Leisure', examples: 'Sport, Musik hören, Fußball spielen, lesen, kochen, Freunde treffen' }
];

const skills = [
  {
    title: 'Lesen (Reading)',
    icon: BookOpen,
    desc: 'Extracting key information from short, straightforward written materials including public notices, price tags, restaurant menus, timetable schedules, classified ads, and brief personal emails.'
  },
  {
    title: 'Hören (Listening)',
    icon: Headphones,
    desc: 'Understanding essential details in clear, slow-paced standard German speeches, such as airport/train station announcements, telephone number dictations, store greetings, and short daily dialogues.'
  },
  {
    title: 'Schreiben (Writing)',
    icon: PenTool,
    desc: 'Filling out official registration forms with personal details (name, nationality, date of birth, address) and writing concise personal messages, short invitation notes, or basic emails.'
  },
  {
    title: 'Sprechen (Speaking)',
    icon: MessageSquare,
    desc: 'Introducing oneself and others, asking and answering questions about personal details, ordering at cafés, making simple purchases, and formulating everyday requests and polite responses.'
  }
];

const speakingTopics = [
  { topic: 'Sich vorstellen', details: 'Stating your name, age, home country, current city, mother tongue, and occupations.' },
  { topic: 'Familie & Freunde', details: 'Talking about family size, siblings, marital status, and friends.' },
  { topic: 'Alltag & Tagesablauf', details: 'Describing what you do in the morning, afternoon, and evening.' },
  { topic: 'Wohnen & Umgebung', details: 'Describing your apartment, room layout, furniture, and neighborhood.' },
  { topic: 'Essen und Trinken', details: 'Ordering meals in restaurants, asking for the bill, and discussing food preferences.' },
  { topic: 'Einkaufen', details: 'Asking for sizes, quantities, and prices in clothing stores or grocery supermarkets.' },
  { topic: 'Freizeit & Hobbys', details: 'Discussing sports, instruments, favorite pastimes, and weekend activities.' },
  { topic: 'Arbeit & Beruf', details: 'Explaining your job role, working hours, and study background.' },
  { topic: 'Termine vereinbaren', details: 'Making, accepting, or postponing an appointment with a doctor or colleague.' },
  { topic: 'Reisen & Orientierung', details: 'Buying train tickets, asking for street directions, and hotel check-in inquiries.' }
];

export default function GermanA1SyllabusPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200 font-medium">German A1 Syllabus</span>
        </nav>

        {/* 2. Hero Section */}
        <header className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
            <span>Official CEFR Beginner Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            German A1 Syllabus – Complete Beginner Guide
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Everything you need to master beginner German in one place. Explore the complete German A1 syllabus including core grammar topics, foundational vocabulary lists, reading, writing, listening, speaking competencies, and recognized Goethe-Zertifikat A1 exam requirements.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link 
              href="/courses/german-a1"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base transition-colors shadow-lg hover:shadow-amber-500/20 flex items-center gap-2"
            >
              <span>Explore German A1 Course</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/practice-tests/german-a1"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base border border-slate-700 transition-colors flex items-center gap-2"
            >
              <span>Take Free A1 Practice Test</span>
              <BookOpen className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </header>

        {/* 3. What Is German A1? */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <Compass className="w-7 h-7 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What Is German A1?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-slate-300 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>German A1</strong> is the first recognized stage of language proficiency defined by the Common European Framework of Reference for Languages (CEFR). Designed specifically for absolute beginners with zero previous knowledge, it serves as the essential bedrock for all subsequent German learning.
              </p>
              <p>
                The primary objective of A1 German is to give you functional communicative competence. Instead of dry theoretical rules, the A1 level focuses on language patterns that allow you to participate in simple daily conversations, navigate everyday tasks in German-speaking countries, and understand basic instructions.
              </p>
            </div>
            
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>What You Can Do After Completing A1:</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Understand and use familiar everyday expressions and very basic phrases.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Introduce yourself and others, and ask others about their home, family, and possessions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Interact in a simple way provided the other person talks slowly and clearly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Read simple signs, posters, notices, and short personal messages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Fulfill language requirements for the German Spouse / Family Reunion Visa.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Complete German A1 Syllabus (Grammar & Vocabulary) */}
        <section className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Complete German A1 Syllabus
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              A comprehensive breakdown of every grammatical concept and core vocabulary topic covered in the official beginner curriculum.
            </p>
          </div>

          {/* Grammar Subsection */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">German A1 Grammar Syllabus</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grammarModules.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <span className="text-xs font-mono text-amber-400">#{idx + 1}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vocabulary Subsection */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Languages className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">German A1 Vocabulary Domains</h3>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At the A1 level, learners acquire an active working vocabulary of approximately 500 to 800 high-frequency words across routine life domains:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vocabCategories.map((cat, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-amber-400">{cat.name}</h4>
                  <p className="text-xs text-slate-300 italic font-mono leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    {cat.examples}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. German A1 Language Skills (4 Competencies) */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              German A1 Language Skills
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              The CEFR framework assesses four balanced core competencies. Here is what is expected in each skill area at the A1 beginner level:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, idx) => {
              const IconComp = skill.icon;
              return (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-amber-500/50 transition-colors shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{skill.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {skill.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. German A1 Speaking Topics */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German A1 Speaking Topics</h2>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Spoken communication is the core benchmark of language mastery. The German A1 speaking curriculum focuses on 10 practical conversational situations encountered in daily life:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {speakingTopics.map((item, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">{item.topic}</h3>
                </div>
                <p className="text-xs text-slate-400 pl-8 leading-relaxed">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. German A1 Exam Preparation */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German A1 Exam Preparation</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Upon finishing the A1 syllabus, candidates commonly sit for formal international language exams. The two most widely accepted standardized examinations are the <strong>Goethe-Zertifikat A1: Start Deutsch 1</strong> and the <strong>telc Deutsch A1</strong>. Both examinations assess candidates across four distinct test modules:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Hören (Listening)</span>
                <p className="text-slate-400">~20 minutes. Short daily dialogues, public announcements, and answering multiple-choice questions.</p>
              </div>
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Lesen (Reading)</span>
                <p className="text-slate-400">~25 minutes. Reading short messages, newspaper ads, and directory boards with true/false tasks.</p>
              </div>
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Schreiben (Writing)</span>
                <p className="text-slate-400">~20 minutes. Filling out personal data on a form and composing a short 30-word letter or email.</p>
              </div>
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Sprechen (Speaking)</span>
                <p className="text-slate-400">~15 minutes in a small group. Introducing yourself, spelling words, and asking/answering questions with prompt cards.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950/90 rounded-2xl border border-amber-500/20 text-xs sm:text-sm text-slate-300 space-y-2">
              <span className="font-bold text-amber-400">Official Certification Notice:</span>
              <p className="leading-relaxed">
                A minimum score of 60% (60 out of 100 points) is required to pass. German Learning School is an independent preparatory academy and is not directly affiliated with the Goethe-Institut or telc gGmbH. We prepare students thoroughly for these official standardized tests using exam-aligned curriculum and mock assessments.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/goethe-exam-preparation"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300"
              >
                <span>Goethe Exam Preparation in Pakistan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <Link 
                href="/telc-exam-preparation"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300"
              >
                <span>telc Exam Preparation in Pakistan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 8. German A1 Course at German Learning School */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              German A1 Course at German Learning School
            </h2>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            If you want structured guidance to master the complete syllabus with certified instructors, enroll in our live online <Link href="/courses/german-a1" className="text-amber-400 hover:underline font-semibold">German A1 course</Link> featuring real-time interactive Zoom classes:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <h3 className="font-bold text-white text-base">Live Interactive Zoom Classes</h3>
              <p className="text-slate-400 leading-relaxed">
                Attend live lectures with experienced instructors, ask questions in real time, and practice speaking in a supportive classroom environment.
              </p>
            </div>

            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <h3 className="font-bold text-white text-base">Structured CEFR Curriculum</h3>
              <p className="text-slate-400 leading-relaxed">
                Progress systematically through all 17 grammar milestones and 15 vocabulary domains without feeling overwhelmed.
              </p>
            </div>

            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <h3 className="font-bold text-white text-base">Mock Tests &amp; Exam Drills</h3>
              <p className="text-slate-400 leading-relaxed">
                Complete realistic practice tests and letter-writing drills evaluated with actionable instructor feedback before your official exam.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link 
              href="/courses/german-a1"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors flex items-center gap-2"
            >
              <span>View German A1 Course Batches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/courses"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors flex items-center gap-2"
            >
              <span>Explore All Courses &amp; Fees</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 9. German A1 Syllabus PDF & Free Learning Resources */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              German A1 Syllabus PDF &amp; Free Learning Resources
            </h2>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Rather than requiring a clunky PDF download that quickly becomes outdated, our full German A1 syllabus is published directly on this reference page so you can bookmark and access it on any mobile or desktop browser anytime for free.
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Enhance your A1 self-study with our suite of free online practice tools and guides:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <Link 
              href="/practice-tests/german-a1"
              className="p-5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-colors group block"
            >
              <h3 className="font-bold text-white group-hover:text-amber-400 text-sm sm:text-base mb-1">
                German A1 Practice Test
              </h3>
              <p className="text-xs text-slate-400">Interactive timed quiz testing grammar and vocabulary.</p>
            </Link>

            <Link 
              href="/practice-tests/noun-builder"
              className="p-5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-colors group block"
            >
              <h3 className="font-bold text-white group-hover:text-amber-400 text-sm sm:text-base mb-1">
                Noun Gender Builder
              </h3>
              <p className="text-xs text-slate-400">Master der, die, and das noun articles with instant feedback.</p>
            </Link>

            <Link 
              href="/resources"
              className="p-5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-colors group block"
            >
              <h3 className="font-bold text-white group-hover:text-amber-400 text-sm sm:text-base mb-1">
                Learning Resources Hub
              </h3>
              <p className="text-xs text-slate-400">Grammar tables, case cheat sheets, and study materials.</p>
            </Link>

            <Link 
              href="/german-a1-syllabus"
              className="p-5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-colors group block"
            >
              <h3 className="font-bold text-white group-hover:text-amber-400 text-sm sm:text-base mb-1">
                German A1 Complete Syllabus
              </h3>
              <p className="text-xs text-slate-400">Bookmark this comprehensive CEFR curriculum and grammar overview.</p>
            </Link>
          </div>
        </section>

        {/* 10. Frequently Asked Questions */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-md">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-start gap-2">
                  <span className="text-amber-400 font-extrabold">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
