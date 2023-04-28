import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { ClimateRiskData } from "../types/ClimateRiskData";
import { ClimateRiskChartProps } from "../types/ClimateRiskChartPorps";
import { Dropdown } from "./ClimateRiskDropDown";

export const ClimateRiskChart: React.FC<ClimateRiskChartProps> = ({ climateRiskData ,year}) => {
  const [selectedData, setSelectedData] = useState<ClimateRiskData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState("");
  const [selectedAssetName, setSelectedAssetName] = useState("");

  const locations = Array.from(new Set(climateRiskData.map((data) => `${data.lat},${data.lng}`)));
  const businessCategories = Array.from(new Set(climateRiskData.map((data) => data.business_category)));
  const assetNames = Array.from(new Set(climateRiskData.map((data) => data.asset_name)));
  
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    let filteredData = climateRiskData;

    if (selectedLocation) {
      const [lat, lng] = selectedLocation.split(",");
      filteredData = filteredData.filter((data) => data.lat === lat && data.lng === lng);
    }

    if (selectedBusinessCategory) {
      filteredData = filteredData.filter((data) => data.business_category === selectedBusinessCategory);
    }

    if (selectedAssetName) {
      filteredData = filteredData.filter((data) => data.asset_name === selectedAssetName);
    }

    setSelectedData(filteredData);
  }, [climateRiskData, selectedLocation, selectedBusinessCategory, selectedAssetName]);

  useEffect(() => {
    const x = d3
      .scaleLinear()
      .domain(d3.extent(selectedData, (d) => d.year) as [number, number])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(selectedData, (d) => d.risk_rating) as [number, number])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const line = d3
      .line<ClimateRiskData>()
      .x((d) => x(d.year) as number)
      .y((d) => y(d.risk_rating) as number);

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.bottom)
      .attr("fill", "#000000")
      .text("Year")
      .style("color", "red");

    g.append("g")
      .call(yAxis)
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 10)
      .attr("fill", "#000000")
      .attr("transform", "rotate(-90)")
      .text("Risk Rating")
      .style("color", "blue");

    g.selectAll("path.domain")
      .style("stroke", "gray");

    g.selectAll("line")
      .style("stroke", "gray");

    g.selectAll(".tick text")
      .style("color", "green");

    g.append("path")
      .datum(selectedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("d", line);
    }, [selectedData, width, height]);
    return (
      <div className="flex flex-wrap">
      <Dropdown
        label="Location"
        options={locations}
        selectedOption={selectedLocation}
        setSelectedOption={setSelectedLocation}
      />
      <Dropdown
        label="Business Category"
        options={businessCategories}
        selectedOption={selectedBusinessCategory}
        setSelectedOption={setSelectedBusinessCategory}
      />
      <Dropdown
        label="Asset Name"
        options={assetNames}
        selectedOption={selectedAssetName}
        setSelectedOption={setSelectedAssetName}
      />
      <svg ref={svgRef} className="w-full mt-4" width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} />
    </div>
    );
}