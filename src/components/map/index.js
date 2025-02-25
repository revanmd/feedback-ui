// components/Map.jsx
"use client";

import { useState } from "react";
import useLeafletMap from "./hooks/useLeafletMaps";

export default function Map({
  callbackClickMarker,
  callbackCancelMarker,
  callbackPressMap,
  callbackReleaseMap
}) {

  const [center, setCenter] = useState([51.505, -0.09])
  const [zoom, setZoom] = useState(13)

  const mapContainerRef = useLeafletMap({
    center: center,
    zoom: zoom,
    onClickMarker: callbackClickMarker,
    onCancelMarker: callbackCancelMarker,
    onPressMap: callbackPressMap,
    onReleaseMap: callbackReleaseMap
  });

  return <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />;
}

