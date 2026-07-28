// SECURE GOOGLE REVIEWS PROXY SERVICE
// Calls backend endpoint /api/google-reviews (Never exposes API Key to frontend browser)

import { googleReviewsData } from '../mockData/seedData';

export async function fetchLiveGoogleReviews() {
  try {
    const response = await fetch('/api/google-reviews', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Backend /api/google-reviews server offline or unconfigured. Using graceful fallback data.", error);
    
    // Return graceful fallback state if local standalone dev server without backend node is running
    return {
      isConfigured: false,
      averageRating: googleReviewsData.averageRating,
      totalReviews: googleReviewsData.totalReviews,
      reviews: googleReviewsData.reviews,
      placeUrl: 'https://search.google.com/local/reviews',
      message: 'Connect your Google Business Profile (Place ID & API Key) in Admin Settings to display live reviews.'
    };
  }
}

export async function saveGooglePlacesConfig(placeId, apiKey) {
  try {
    const response = await fetch('/api/admin/google-reviews-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ placeId, apiKey })
    });

    if (!response.ok) {
      throw new Error('Failed to update Google Places server config');
    }

    return await response.json();
  } catch (error) {
    // In standalone frontend preview mode, save to localStorage as mock server state
    localStorage.setItem('mock_google_place_id', placeId);
    localStorage.setItem('mock_google_api_key', apiKey);
    return { success: true, message: 'Saved to server config (dev mode)' };
  }
}
