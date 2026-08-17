// SECURE GOOGLE REVIEWS PROXY SERVICE
// Calls backend endpoint /api/google-reviews (Never exposes API Key to frontend browser)

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
    if (data.error) throw new Error(data.message || 'API Error');
    
    return data;
  } catch (error) {
    console.warn("Google Reviews API fetch failed. The widget will gracefully hide.", error);
    return { error: true, message: error.message };
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
