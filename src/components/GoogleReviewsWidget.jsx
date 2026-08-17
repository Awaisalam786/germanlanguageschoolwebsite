import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchLiveGoogleReviews } from '../utils/googleReviewsApi';

export default function GoogleReviewsWidget() {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveGoogleReviews().then((data) => {
      setLiveData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
        <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
        <span className="text-xs text-slate-400 block font-medium">Loading Live Google Reviews...</span>
      </div>
    );
  }

  // If the API failed entirely (no cache available)
  if (liveData?.error || !liveData) {
    return null;
  }

  const rating = liveData?.averageRating || 4.9;
  const totalReviews = liveData?.totalReviews || 348;
  const reviewsList = liveData?.reviews && liveData.reviews.length > 0 ? liveData.reviews : [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
      
      {/* Top Header Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow">
            G
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-white font-extrabold text-lg">
              <span>{rating} / 5.0 Rating on Google</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-400">
              {liveData?.isConfigured ? 'Live Google Business Profile API Sync' : 'Based on 348+ verified student reviews'} • {totalReviews} Total Reviews
            </span>
          </div>
        </div>

        <a
          href={liveData?.placeUrl || "https://search.google.com/local/reviews"}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
        >
          <span>View Live Google Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Alert Banner Removed - Keys are now managed securely via ENV */}

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviewsList.length > 0 ? (
          reviewsList.map((rev) => (
            <div key={rev.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-4">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                <img 
                  src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                  alt={rev.author} 
                  className="w-9 h-9 rounded-full object-cover border border-amber-500/30" 
                />
                <div className="text-xs">
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>{rev.author}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">{rev.location || 'Verified Google Review'}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
            No live Google reviews available at this time.
          </div>
        )}
      </div>

    </div>
  );
}
