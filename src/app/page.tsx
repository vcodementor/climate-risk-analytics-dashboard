'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Papa from 'papaparse';
import { ClimateRiskData } from './types/ClimateRiskData';
import { ClimateRiskChart } from './components/ClimateRiskChart';
import { ClimateRiskDataTable } from './components/ClimateRiskDataTable';
// import { ClimateRiskMap } from './components/ClimateRiskMap';

import dynamic from 'next/dynamic';

// const ClimateRiskMap = dynamic(
//   () => import('./components/ClimateRiskMap') as Promise<any>, 
//   { loading: () => <div> map loading </div> } 
// );

const ClimateRiskMap = dynamic(
  () => import('./components/ClimateRiskMap').then((module) => module.ClimateRiskMap),
  { ssr: false }
);

export default function Page() {
  const [climateRiskData, setClimateRiskData] = useState<ClimateRiskData[]>([]);
  const [year, setYear] = useState(2030);

  useEffect(() => {
    async function fetchRiskMapData() {
      const response = await fetch('/assets/file/climate-risk-rating.csv');

      const text = await response.text();
      const lines  = Papa.parse(text).data;
      const headers:any = lines[0];
      const data = lines.slice(1).map((line:any) => {
        const climateRiskData:ClimateRiskData = {} as ClimateRiskData;
        headers.forEach((header:any, index:any) => {
          if (header === 'risk_factors') {
            climateRiskData[header] = line[index];
          } else {
            climateRiskData[header] = line[index].replace(/""/g, "\"");
          }          
        });
        return climateRiskData;
      })

      setClimateRiskData(data);

    }
    fetchRiskMapData();
  }, []);

  function handleYearChange(event: React.SyntheticEvent, value: number) {
    setYear(value);
  }

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Climate Risk</title>
      </Head>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg py-6 pb-11">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 px-4">Climate Risk Map</h2>
          <ClimateRiskMap climateRiskData={climateRiskData} year={year} onYearChange={handleYearChange} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Climate Risk Chart</h2>
          <ClimateRiskChart climateRiskData={climateRiskData} year={year}/>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 my-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Climate Risk Datatable</h2>
        <ClimateRiskDataTable climateRiskData={climateRiskData} year={year} onYearChange={handleYearChange} />
      </div>
    </div>
  );
}