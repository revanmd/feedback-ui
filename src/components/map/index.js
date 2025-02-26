// components/Map.jsx
"use client";

import { useEffect, useState } from "react";
import { MdGpsFixed } from "react-icons/md";
import useLeafletMap from "./hooks/useLeafletMaps";

export default function Map({
  callbackClickMarker,
  callbackCancelMarker,
  callbackPressMap,
  callbackReleaseMap
}) {
  const [zoom, setZoom] = useState(13)

  const { 
      mapContainerRef, 
      setCenter, 
      addLayer, 
      removeLayer, 
      drawMarkers, 
      filterMarkers
  } = useLeafletMap({
    zoom: zoom,
    onClickMarker: callbackClickMarker,
    onCancelMarker: callbackCancelMarker,
    onPressMap: callbackPressMap,
    onReleaseMap: callbackReleaseMap
  });

  const handleGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }, 18);
        },
        (error) => {
          alert(error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  useEffect(()=>{
    // add layer to the map
    addLayer('https://tile.digitalisasi-pi.com/data/merged_output_jatim_rgb/{z}/{x}/{y}.png')
  },[])

  return (
    <div>
      <div style={{ zIndex: 1000, position: 'absolute', bottom: 65, right: 5 }} >
        <div onClick={handleGPS} className="bg-white rounded-full p-5 shadow-md" >
          <MdGpsFixed 
            className="text-3xl text-gray-500"
          />
        </div>
      </div>
      <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }}  />

    </div>

  );
}

