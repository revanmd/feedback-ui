import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function useLeafletMap({
  center = [-7.5360639, 112.2384017],
  zoom = 13,
  tileLayerUrl = "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  markers = [],
  onClickMarker,
  onCancelMarker,
  onPressMap,
  onReleaseMap,
} = {}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);
  const markerLayerRef = useRef(null);


  const _initialize = (container, instance) => {
    if (!container.current || instance.current) return;
    instance.current = L.map(container.current, { 
        center, 
        zoom,
        zoomControl: false, 
      });
    L.tileLayer(tileLayerUrl).addTo(instance.current);
    markerLayerRef.current = L.layerGroup().addTo(instance.current);

    // Attach press event
    if (onPressMap) {
      instance.current.on("contextmenu", (event) => {
        const { lat, lng } = event.latlng;
        mapInstanceRef.current.setView(event.latlng);
        onPressMap({ lat, lng });
      });
    }
  };


  const _destroy = (instance) => {
    if (instance.current) {
      instance.current.eachLayer((layer) => instance.current.removeLayer(layer));
      instance.current.remove();
      instance.current = null;
      layersRef.current = [];
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



  const setCenter = useCallback((newCenter, newZoom = zoom) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(newCenter, newZoom);
    }
  }, []);



  const addLayer = useCallback((layerUrl, options = {}) => {
    if (mapInstanceRef.current) {
      const newLayer = L.tileLayer(layerUrl, options).addTo(mapInstanceRef.current);
      layersRef.current.push(newLayer);
    }
  }, []);



  const removeLayer = useCallback((layerUrl) => {
    if (mapInstanceRef.current) {
      const layerIndex = layersRef.current.findIndex(layer => layer._url === layerUrl);
      if (layerIndex !== -1) {
        mapInstanceRef.current.removeLayer(layersRef.current[layerIndex]);
        layersRef.current.splice(layerIndex, 1);
      }
    }
  }, []);



  const drawMarkers = useCallback((markerData) => {
    if (!mapInstanceRef.current || !markerLayerRef.current) return;
    markerLayerRef.current.clearLayers(); 
    markerData.forEach(({ position, icon, data }) => {
      const marker = L.marker(position, { icon: icon || undefined }).addTo(markerLayerRef.current);
      if (onClickMarker) marker.on("click", () => onClickMarker(data));
    });
  }, [onClickMarker]);



  const filterMarkers = useCallback((filterFn) => {
    if (!mapInstanceRef.current || !markerLayerRef.current) return;
    const filteredMarkers = markers.filter(filterFn);
    drawMarkers(filteredMarkers);
  }, [markers, drawMarkers]);



  return { mapContainerRef, setCenter, addLayer, removeLayer, drawMarkers, filterMarkers };
}
