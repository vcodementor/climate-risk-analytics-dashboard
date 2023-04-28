import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ClimateRiskMapProps } from '../types/ClimateRiskMapProps';
import { ClimateRiskData } from '../types/ClimateRiskData';
import { ClimateRiskMapControls } from './ClimateRiskMapControls';
import { ClimateRiskMapMarkers } from './ClimateRiskMapMarkers';

import L, { ControlPosition, LatLng, LatLngBounds } from 'leaflet';

export function ClimateRiskMap({ climateRiskData, year, onYearChange }: ClimateRiskMapProps) {
  const [markers, setMarkers] = useState<ClimateRiskData[]>([]);
  const zoomControlPosition: ControlPosition = 'bottomleft';
  const [mapCenter, setMapCenter] = useState<LatLng>(L.latLng(46.1351,-60.1831));

  
  useEffect(() => {

    const filteredMarkers = climateRiskData.filter((marker) => {
      const markerYear = Math.floor(marker.year / 10) * 10; // Round down to nearest decade
      return markerYear === year;
    });
    setMarkers(filteredMarkers)
    // Compute the center point of all markers
     
    const markerPositions: LatLng[] = filteredMarkers.map((marker) =>
      L.latLng(marker.lat, marker.lng)
    );
    if(markerPositions.length > 0 ){
      const bounds = new LatLngBounds(
        markerPositions[0], 
        markerPositions[markerPositions.length - 1] 
      );
      const mapCenter = bounds.getCenter();
      setMapCenter(mapCenter);
    }

  }, [climateRiskData, year]);

  return (
    <MapContainer center={mapCenter} zoom={2} scrollWheelZoom={true} className="w-full h-full"   attributionControl={false}
    zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClimateRiskMapMarkers markers={markers} />
      <ZoomControl position={zoomControlPosition} />
      <ClimateRiskMapControls climateRiskData={climateRiskData} year={year} onYearChange={onYearChange} />
    </MapContainer>
  );
}

