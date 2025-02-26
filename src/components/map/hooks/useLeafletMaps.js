import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function useLeafletMap({
  center = [-7.5360639, 112.2384017],
  zoom = 13,
  tileLayerUrl = "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", // Google Satellite imagery
  markers = [],
  onClickMarker, // Optional click handler
  onCancelMarker,
  onPressMap,
  onReleaseMap,
} = {}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const _initialize = (container, instance) => {
    instance.current = L.map(container.current, {
      center,
      zoom,
    });
    L.tileLayer(tileLayerUrl).addTo(instance.current);
    // Add the TileServer-GL XYZ layer
    L.tileLayer('https://tile.digitalisasi-pi.com/data/merged_output_jatim_rgb/{z}/{x}/{y}.png', {
      maxZoom: 18,
      tileSize: 256,
      zoomOffset: 0,
    }).addTo(instance.current);
  };

  const _destroy = (instance) => {
    if (instance.current) {
      instance.current.remove();
      instance.current = null;
    }
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      _initialize(mapContainerRef, mapInstanceRef);
    }

    return () => {
      if (mapInstanceRef.current) {
        _destroy(mapInstanceRef);
      }
    };
  }, [tileLayerUrl]);

  // Function to update the center without reinitializing
  const setCenter = useCallback((newCenter, newZoom = zoom) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(newCenter, newZoom);
    }
  }, [zoom]);

  return { mapContainerRef, setCenter };
}
