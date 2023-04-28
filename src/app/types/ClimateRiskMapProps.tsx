import { ClimateRiskData } from "./ClimateRiskData";

export interface ClimateRiskMapProps {
    climateRiskData: ClimateRiskData[];
    year: number;
    onYearChange: (event: React.SyntheticEvent<Element, Event>, value: number) => void;
}