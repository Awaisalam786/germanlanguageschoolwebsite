import { NextResponse } from 'next/server';

let staleCache = null;

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_PLACE_ID;

  if (!apiKey || !placeId) {
    if (staleCache) return NextResponse.json(staleCache);
    return NextResponse.json({ error: true, message: 'Missing API Key or Place ID' }, { status: 500 });
  }

  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
      },
      signal: controller.signal,
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google API error: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    
    // Map the API response into the same shape the component already consumes
    const reviewsList = (data.reviews || []).map((r, index) => ({
      id: r.name || index.toString(),
      rating: r.rating,
      text: r.text?.text || '',
      date: r.relativePublishTimeDescription || '',
      avatar: r.authorAttribution?.photoUri || '',
      author: r.authorAttribution?.displayName || 'Anonymous',
      
      // Exact keys from prompt's mapping table
      author_name: r.authorAttribution?.displayName,
      author_url: r.authorAttribution?.uri,
      profile_photo_url: r.authorAttribution?.photoUri,
      relative_time_description: r.relativePublishTimeDescription,
      language: r.text?.languageCode,
      time: r.publishTime ? new Date(r.publishTime).getTime() / 1000 : null
    }));

    const normalized = {
      isConfigured: true,
      averageRating: data.rating || 5,
      totalReviews: data.userRatingCount || 0,
      placeUrl: data.googleMapsUri || 'https://search.google.com/local/reviews',
      reviews: reviewsList,
      
      // Exact keys from prompt's mapping table
      rating: data.rating,
      user_ratings_total: data.userRatingCount,
      google_maps_url: data.googleMapsUri,
    };

    staleCache = normalized;
    return NextResponse.json(normalized);

  } catch (error) {
    console.error('[Google Reviews API]', error.message);
    if (staleCache) {
      return NextResponse.json(staleCache);
    }
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}
