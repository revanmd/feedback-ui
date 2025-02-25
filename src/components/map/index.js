// components/Map.jsx
"use client";

import { useState } from "react";
import { MdGpsFixed } from "react-icons/md";
import useLeafletMap from "./hooks/useLeafletMaps";

export default function Map({
  callbackClickMarker,
  callbackCancelMarker,
  callbackPressMap,
  callbackReleaseMap
}) {
  const [zoom, setZoom] = useState(13)

  const { mapContainerRef, setCenter } = useLeafletMap({
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
          });
        },
        (error) => {
          alert(error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  return (
    <div>
      <div style={{ zIndex: 1000, position: 'absolute', bottom: 70, right: 5 }}>
        <div onClick={handleGPS} className="bg-white rounded-full p-3">
          <MdGpsFixed className="text-xl" />
        </div>
      </div>
      <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />
    </div>

  );
}

