// ─── Price & Aesthetic Types ────────────────────────────────────────

/** Price tier indicator: $ (budget) through $$$$ (luxury) */
export type PriceTier = '$' | '$$' | '$$$' | '$$$$';

/** Numeric scores (0–10) for each aesthetic axis, used in the radar chart */
export interface AestheticScores {
  minimalism: number;
  streetwear: number;
  avantGarde: number;
  luxury: number;
  heritage: number;
  contemporary: number;
}

// ─── Brand Types ────────────────────────────────────────────────────

/** Profile of the brand the user searched for */
export interface BrandProfile {
  name: string;
  priceTier: PriceTier;
  aestheticTags: string[];
  description: string;
  aestheticScores: AestheticScores;
}

/** A single brand recommendation returned by the API */
export interface BrandRecommendation {
  name: string;
  priceTier: PriceTier;
  aestheticTags: string[];
  description: string;
  similarityReason: string;
  websiteUrl: string;
  similarityScore: number; // 0–100
}

// ─── API Types ──────────────────────────────────────────────────────

/** Shape of the JSON payload returned by the recommendation endpoint */
export interface RecommendationResponse {
  searchedBrand: BrandProfile;
  recommendations: BrandRecommendation[];
  confidenceLevel?: 'high' | 'low_with_description';
}

/** Response shape for the "find more" follow-up endpoint */
export interface MoreRecommendationsResponse {
  recommendations: BrandRecommendation[];
}

/** Body of the POST request to /api/recommendations */
export interface SearchRequest {
  brandName: string;
  brandDescription?: string;
}

/** Body of the POST request to /api/recommendations/more */
export interface MoreRequest {
  brandName: string;
  brandDescription?: string;
  excludeBrands: string[];
  pricePreference?: 'more_affordable' | 'same_price' | 'any';
  refinementNote?: string;
}

/** Error response from the API */
export interface ApiError {
  error: string;
  message: string;
}

// ─── Filter Types ───────────────────────────────────────────────────

/** Current state of the result filters (price, tags, affordable toggle) */
export interface FilterState {
  priceTiers: PriceTier[];
  aestheticTags: string[];
  affordableOnly: boolean;
}

// ─── Favorites Types ────────────────────────────────────────────────

/** A brand saved to the user's collection (persisted in localStorage) */
export interface FavoriteBrand extends BrandRecommendation {
  savedAt: string;       // ISO 8601 date string
  searchedFrom: string;  // The brand name the user searched to find this
}
