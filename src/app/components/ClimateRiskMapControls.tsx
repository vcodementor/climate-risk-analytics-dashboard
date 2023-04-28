import { useEffect, useState } from 'react';
import { ClimateRiskMapControlsProps } from '../types/ClimateRiskMapControlsProps';

export function ClimateRiskMapControls({ climateRiskData, year ,onYearChange }: ClimateRiskMapControlsProps) {
  const [years, setYears] = useState<number[]>([]);

  // Extract the years from the data prop and set them as options for the year select element
  useEffect(() => {
    const yearsSet = new Set<number>();
    climateRiskData.forEach((d) => yearsSet.add(d.year));
    const years = Array.from(yearsSet).sort((one, two) => (one > two ? -1 : 1));
    setYears(years);
  }, [climateRiskData]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    onYearChange(event,newYear);
  };

  return (
    <div className="leaflet-control m-4">
      <div className="bg-white rounded-md shadow-md p-4">
        <label htmlFor="year-select" className="block text-gray-700 font-bold mb-2">Select Decade:</label>
        <select 
          id="year-select" 
          value={year} 
          onChange={handleYearChange} 
          className="text-black block w-full rounded-md p-2 bg-gray-100 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        >
          {years.map((year, i) => (
            <option key={i} value={year}>{year}s</option>
          ))}
        </select>
      </div>
    </div>
  );
}
 