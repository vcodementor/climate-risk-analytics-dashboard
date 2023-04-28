import { useEffect, useState } from "react";
import { Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { ClimateRiskMapMarkersProps } from "../types/ClimateRiskMapMarkersProps";

export function ClimateRiskMapMarkers({ markers }: ClimateRiskMapMarkersProps) {
    const map = useMap();
    const [visibleMarkers, setVisibleMarkers] = useState();
    
    useEffect(() => {
      // Update the size of the map when the markers change
      map.invalidateSize();

    }, [markers, map]);
  
    return (
      <>
        {markers.map((marker:any, i:any) => (
          <Marker key={i} position={[marker.lat, marker.lng]} icon={getMarkerIcon(marker.risk_rating)}>
            <Popup>
              <p>{marker.asset_name}</p>
              <p>{marker.business_category}</p>
              {/* <p>{marker.risk_factors}</p> */}
              <p>{marker.risk_rating}</p>
            </Popup>
            <Tooltip>
              <p>{marker.asset_name}</p>
              <p>{marker.business_category}</p>
              {/* <p>{marker.risk_factors}</p> */}
              <p>{marker.risk_rating}</p>
            </Tooltip>
          </Marker>
        ))}
      </>
    );
  }
  
  function getMarkerIcon(risk: any) {
      // Calculate the color index based on the probability
       const colorIndex = Math.floor(parseInt(risk) / 1);

       // Select the appropriate color from the array
       const colors = ['green', 'yellow', 'orange', 'red'];
       const color = colors[colorIndex];
    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
    });
  }