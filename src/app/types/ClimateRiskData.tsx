export interface ClimateRiskData {
    [key: string]: any;
    asset_name: string;
    lat: number;
    lng: number;
    business_category: string;
    risk_rating: number;
    risk_factors:object
    year: number;
}
  