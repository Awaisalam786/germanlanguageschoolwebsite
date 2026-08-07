import React from 'react';
import { 
  Package, 
  Sparkles, 
  MessageCircle, 
  Clock, 
  Tag
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';
import ScrollReveal from './ScrollReveal';

export default function CourseBundles() {
  const { settings } = useGlobalContent();
  const formattedPhone = settings?.whatsapp_number?.replace(/^0/, '92') || '923421189593';
  const [bundles, setBundles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBundles = async () => {
      const { data } = await supabase.from('course_bundles').select('*').order('created_at', { ascending: true });
      if (data) {
        setBundles(data);
      }
      setLoading(false);
    };
    fetchBundles();
  }, []);

  const handleWhatsAppEnrollBundle = (bundleTitle) => {
    const msg = encodeURIComponent(`Hi, I want to enroll in the ${bundleTitle}. Please share payment details.`);
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, '_blank');
  };

  return (
    <section className="space-y-8 pt-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-extrabold shadow-sm">
          <Package className="w-4 h-4 text-amber-400" />
          <span>Discounted Multi-Level Package Bundles</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Course Bundles & Special Package Savings
        </h2>
        <p className="text-sm text-slate-300">
          Save up to ₨31,000 PKR by booking your multi-level German learning pathway in advance.
        </p>
      </div>

      {/* Grid of 3 Bundle Cards (A1-A2, A1-B1, A1-B2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-slate-400">Loading course bundles...</div>
        ) : bundles.map((bundle) => (
          <ScrollReveal key={bundle.id} className="h-full">
            <div
              onClick={() => handleWhatsAppEnrollBundle(bundle.title)}
              className={`group relative rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between shadow-2xl hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer overflow-hidden backdrop-blur-xl h-full ${
                bundle.isRecommended
                  ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/60 border-2 border-amber-500/60 shadow-gold-glow'
                  : 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-amber-500/20 hover:border-amber-500/50'
              }`}
            >
            {/* Top Accent Gradient Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-red-500 to-amber-600" />

            <div className="space-y-5">
              
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                
                {/* Save Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-extrabold">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{bundle.badge}</span>
                </div>

                {/* Recommended Ribbon */}
                {bundle.recommendedRibbon && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-slate-950 text-[10px] font-extrabold shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{bundle.recommendedRibbon}</span>
                  </div>
                )}

              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors">
                  {bundle.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {bundle.description}
                </p>
              </div>

              {/* Levels Included Chips */}
              <div className="space-y-2 w-full">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Included CEFR Levels</span>
                <div className="flex flex-nowrap sm:flex-wrap w-full gap-1 sm:gap-1.5">
                  {bundle.levelsIncluded.map((lvl) => (
                    <span 
                      key={lvl}
                      className="flex-1 min-w-0 text-[9px] sm:text-xs p-1 sm:px-2.5 sm:py-1 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-400 font-bold shadow-sm whitespace-nowrap overflow-hidden text-ellipsis text-center sm:flex-none sm:overflow-visible"
                    >
                      {lvl} Level
                    </span>
                  ))}
                </div>
              </div>

              {/* Duration Meta */}
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Estimated Duration: {bundle.duration}</span>
              </div>

            </div>

            {/* Bundle Pricing Footer */}
            <div className="pt-5 mt-5 border-t border-slate-800/80 space-y-4">
              
              <div className="flex items-end justify-between gap-2 sm:gap-3">
                
                {/* Price Display */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="text-[10px] sm:text-xs text-slate-500 line-through font-bold">{bundle.originalPricePKR}</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[8px] sm:text-[10px] font-extrabold border border-emerald-500/40">
                      {bundle.youSaveText}
                    </span>
                  </div>
                  <div className="text-sm sm:text-xl font-extrabold text-amber-400 leading-none">
                    {bundle.bundlePricePKR}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-400">
                    {bundle.bundlePriceEUR}
                  </div>
                </div>

                {/* Enroll Now Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsAppEnrollBundle(bundle.title);
                  }}
                  className="group/btn shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-[10px] sm:text-xs font-extrabold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0 animate-pulse group-hover/btn:scale-110 transition-transform duration-300" />
                  <span className="whitespace-nowrap">Enroll Now</span>
                </button>

              </div>

            </div>

          </div>
          </ScrollReveal>
        ))}
      </div>

    </section>
  );
}
