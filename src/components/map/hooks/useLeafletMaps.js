import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function useLeafletMap({
  center = [51.505, -0.09],
  zoom = 13 ,
  tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
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
  }

  const _destroy = (instance) => {
    instance.current.remove();
    instance.current = null;
  }


  useEffect(() => {
    // initialize the map
    if (mapContainerRef.current && !mapInstanceRef.current) {
      _initialize(mapContainerRef, mapInstanceRef);
    }

    // unmount before reinitialize
    return () => {
      if (mapInstanceRef.current) {
        _destroy(mapInstanceRef)
      }
    };
  }, [center, zoom, tileLayerUrl]);

  return mapContainerRef;
}
