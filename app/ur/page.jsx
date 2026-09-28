import React from 'react';
import Link from 'next/link';
import SchemaMarkup from '../../src/components/SchemaMarkup';
import { withPageOpenGraph } from '../../src/lib/seo';

// Server-rendered Urdu landing page (crawlable Urdu content with its own URL).
// Keep facts in line with the English pages it links to: course durations come
// from src/lib/seoLevelData.js, visa language levels from
// /german-language-requirements-germany (official sources, dated there).
// Urdu wording should be reviewed by a native speaker before large edits.
const LAST_REVIEWED = '28 ستمبر 2026';
const SITE = 'https://germanlearningschool.com';
const WHATSAPP = 'https://wa.me/923421189593';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'جرمن زبان کا آن لائن کورس پاکستان | German Learning School',
  },
  description:
    'پاکستان میں آن لائن جرمن زبان سیکھیں: A1 سے B2 تک زوم پر لائیو کلاسز، ریکارڈنگز، اور گوئٹے، ٹیلک، ÖSD اور ٹیسٹ ڈاف امتحانات کی تیاری۔',
  alternates: {
    canonical: '/ur',
    languages: {
      en: `${SITE}/`,
      ur: `${SITE}/ur`,
      'x-default': `${SITE}/`,
    },
  },
  openGraph: {
    locale: 'ur_PK',
    alternateLocale: ['en_PK'],
  },
});

const levels = [
  {
    level: 'A1',
    href: '/courses/german-a1',
    duration: 'تقریباً 6 سے 8 ہفتے (لگ بھگ 80 گھنٹے)',
    text: 'بالکل ابتدائی لیول: تعارف، روزمرہ جملے، نمبر، وقت اور بنیادی گرامر۔ گوئٹے A1 اور ٹیلک A1 کی تیاری۔',
  },
  {
    level: 'A2',
    href: '/courses/german-a2',
    duration: 'تقریباً 6 سے 8 ہفتے (لگ بھگ 80 گھنٹے)',
    text: 'روزمرہ گفتگو، ماضی کا زمانہ اور ڈیٹیو کیس۔ A2 کے بعد B1 کی طرف اگلا قدم۔',
  },
  {
    level: 'B1',
    href: '/courses/german-b1',
    duration: 'تقریباً 8 سے 10 ہفتے (لگ بھگ 100 گھنٹے)',
    text: 'کام اور روزمرہ زندگی میں خود مختار گفتگو۔ آؤس بلڈونگ (Ausbildung) ویزا کے لیے عام طور پر B1 درکار ہوتا ہے۔',
  },
  {
    level: 'B2',
    href: '/courses/german-b2',
    duration: 'تقریباً 10 سے 12 ہفتے (لگ بھگ 120 گھنٹے)',
    text: 'پیشہ ورانہ اور تعلیمی جرمن۔ یونیورسٹی کی تیاری اور میڈیکل جرمن امتحانات کی بنیاد۔',
  },
];

const exams = [
  { name: 'گوئٹے (Goethe-Zertifikat)', href: '/goethe-exam-preparation' },
  { name: 'ٹیلک (telc Deutsch)', href: '/telc-exam-preparation' },
  { name: 'ÖSD (آسٹریا کا جرمن امتحان)', href: '/osd-exam-preparation' },
  { name: 'ٹیسٹ ڈاف (TestDaF)', href: '/testdaf-preparation' },
];

const faqs = [
  {
    q: 'کیا میں پاکستان کے کسی بھی شہر سے آن لائن جرمن زبان سیکھ سکتا ہوں؟',
    a: 'جی ہاں۔ تمام کلاسز زوم پر لائیو ہوتی ہیں، اس لیے کراچی، لاہور، اسلام آباد یا پاکستان کے کسی بھی شہر سے گھر بیٹھے شامل ہو سکتے ہیں۔ ہمارا کوئی فزیکل کیمپس نہیں ہے۔',
  },
  {
    q: 'اگر کوئی کلاس رہ جائے تو کیا ہوگا؟',
    a: 'لائیو لیکچرز ریکارڈ کیے جاتے ہیں، اس لیے آپ چھوٹی ہوئی کلاس بعد میں دیکھ کر دہرا سکتے ہیں۔',
  },
  {
    q: 'کیا آپ امتحان بھی لیتے ہیں؟',
    a: 'نہیں۔ ہم صرف تیاری کرواتے ہیں۔ گوئٹے، ٹیلک، ÖSD یا ٹیسٹ ڈاف کا سرکاری امتحان آپ متعلقہ ادارے یا اس کے لائسنس یافتہ امتحانی مرکز میں خود بک کرتے ہیں۔',
  },
  {
    q: 'فیس اور نئے بیچ کی تاریخیں کہاں دیکھیں؟',
    a: 'موجودہ فیس اور بیچ ٹائمنگز کورسز کے صفحے پر دی گئی ہیں۔ داخلے کے لیے واٹس ایپ پر رابطہ کریں۔',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'ur',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const h2 = 'text-2xl sm:text-3xl font-extrabold text-white leading-relaxed';
const body = 'text-slate-300 text-base sm:text-lg leading-loose';
const link = 'text-amber-400 hover:underline';

export default function UrduHomePage() {
  return (
    <>
      <SchemaMarkup schema={faqSchema} />
      <div lang="ur" dir="rtl" className="font-urdu max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <header className="space-y-5 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/30">
            پاکستان کے لیے آن لائن جرمن لینگویج اسکول
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-relaxed">
            جرمن زبان کا آن لائن کورس: پاکستان میں A1 سے B2 تک
          </h1>
          <p className="text-slate-200 text-base sm:text-lg leading-loose max-w-3xl mx-auto">
            <strong className="text-white">مختصر جواب:</strong>{' '}
            German Learning School پاکستان کے طلبہ کو زوم پر لائیو کلاسز کے ذریعے جرمن زبان سکھاتا ہے، A1 سے B2 تک۔
            ہر لیکچر ریکارڈ ہوتا ہے، اور ساتھ میں گوئٹے، ٹیلک، ÖSD اور ٹیسٹ ڈاف امتحانات کی تیاری کروائی جاتی ہے۔
            داخلہ واٹس ایپ پر ہوتا ہے۔
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/courses" className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold">
              کورسز اور فیس دیکھیں
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              واٹس ایپ پر داخلہ لیں
            </a>
          </div>
        </header>

        <section className="space-y-6">
          <h2 className={h2}>ہمارے جرمن کورسز: A1 سے B2 تک</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {levels.map((l) => (
              <div key={l.level} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-xl font-bold text-white">
                  جرمن <span dir="ltr">{l.level}</span> کورس
                </h3>
                <p className="text-amber-400 text-sm font-bold">{l.duration}</p>
                <p className="text-slate-300 leading-loose">{l.text}</p>
                <Link href={l.href} className={`${link} text-sm font-bold`}>
                  مکمل تفصیل اور نصاب (انگریزی میں)
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={h2}>جرمن امتحانات کی تیاری</h2>
          <p className={body}>
            ہم گوئٹے، ٹیلک، ÖSD اور ٹیسٹ ڈاف امتحانات کی تیاری کرواتے ہیں۔ یہ چاروں امتحانات CEFR لیولز کے مطابق ہوتے ہیں۔
            کون سا امتحان دینا ہے، یہ اس بات پر منحصر ہے کہ آپ کی یونیورسٹی، آجر یا جرمن سفارت خانہ کون سا سرٹیفکیٹ قبول کرتا ہے۔
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {exams.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="block bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 text-white font-bold">
                  {e.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className={body}>
            اپنا لیول جانچنے کے لیے ہمارے{' '}
            <Link href="/practice-tests" className={link}>مفت جرمن پریکٹس ٹیسٹ</Link>{' '}
            دیں۔
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className={h2}>جرمنی جانے کے لیے کون سا جرمن لیول چاہیے؟</h2>
          <p className={body}>یہ آپ کے راستے پر منحصر ہے۔ عام اصول یہ ہیں:</p>
          <ul className="list-disc pr-6 space-y-2 text-slate-300 leading-loose">
            <li>اپرچونٹی کارڈ (Chancenkarte): پوائنٹس والے راستے میں کم از کم A1 جرمن یا B2 انگریزی۔</li>
            <li>آؤس بلڈونگ (Ausbildung) ویزا: عام طور پر B1 جرمن۔</li>
            <li>شریکِ حیات کا ویزا: اکثر بنیادی جرمن (A1)، لیکن کچھ صورتوں میں استثنا ہوتا ہے۔</li>
            <li>ڈاکٹرز: عام طور پر B2 جنرل جرمن اور میڈیکل زبان کا امتحان، متعلقہ جرمن صوبے کی شرائط کے مطابق۔</li>
            <li>نرسز: صوبے کے مطابق عموماً B1 یا B2۔</li>
          </ul>
          <p className={body}>
            یہ شرائط بدل سکتی ہیں، اس لیے درخواست سے پہلے سرکاری ذرائع سے تصدیق کریں۔ تفصیل اور سرکاری حوالوں کے لیے دیکھیں:{' '}
            <Link href="/german-language-requirements-germany" className={link}>German language requirements for Germany</Link>
            ۔ آخری جائزہ: {LAST_REVIEWED}۔
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={h2}>آن لائن کلاسز کیسے ہوتی ہیں؟</h2>
          <p className={body}>
            کلاسز مقررہ بیچز میں زوم پر لائیو ہوتی ہیں۔ آپ موبائل یا لیپ ٹاپ سے شامل ہوتے ہیں، استاد اور ہم جماعتوں کے ساتھ بول کر مشق کرتے ہیں،
            اور لیکچرز کی ریکارڈنگ بعد میں دیکھ سکتے ہیں۔ مزید تفصیل کے لیے{' '}
            <Link href="/howItWorks" className={link}>آن لائن کلاسز کا طریقہ</Link>{' '}
            دیکھیں۔
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={h2}>اکثر پوچھے جانے والے سوالات</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-white leading-relaxed">{f.q}</h3>
                <p className="text-slate-300 leading-loose mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center space-y-3">
          <p className={body}>
            <Link href="/" className={link} lang="en" dir="ltr">Read this page in English</Link>
          </p>
        </section>
      </div>
    </>
  );
}
