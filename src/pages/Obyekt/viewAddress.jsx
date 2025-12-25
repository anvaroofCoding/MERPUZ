import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function YandexMapViewMobile() {
  const mapRef = useRef(null);
  const placemarkRef = useRef(null);
  const mapContainerRef = useRef(null);

  const { lat, lng } = useParams(); // paramsdan keladi
  const [location, setLocation] = useState(
    lat && lng ? { lat: Number(lat), lng: Number(lng) } : null,
  );

  useEffect(() => {
    if (!window.ymaps) return;
    if (mapRef.current) return;

    window.ymaps.ready(() => {
      const map = new window.ymaps.Map(mapContainerRef.current, {
        center: location ? [location.lat, location.lng] : [41.2995, 69.2401],
        zoom: 12,
      });

      mapRef.current = map;

      // agar paramsdan kelgan locatsiya bo'lsa marker qo'yish
      if (location) {
        placemarkRef.current = new window.ymaps.Placemark([
          location.lat,
          location.lng,
        ]);
        map.geoObjects.add(placemarkRef.current);
      }

      map.events.add("click", (e) => {
        const coords = e.get("coords");

        if (placemarkRef.current) {
          placemarkRef.current.geometry.setCoordinates(coords);
        } else {
          placemarkRef.current = new window.ymaps.Placemark(coords);
          map.geoObjects.add(placemarkRef.current);
        }

        const data = {
          lat: Number(coords[0].toFixed(6)),
          lng: Number(coords[1].toFixed(6)),
        };

        setLocation(data);
        console.log("📍 Tanlangan locatsiya:", data);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [lat, lng]);

  // Mobile uchun "Open in Maps" link
  const handleOpenMobileMap = () => {
    if (!location) return;

    const url = `https://yandex.com/maps/?pt=${location.lng},${location.lat}&z=16&l=map`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative w-full h-[400px] rounded-md overflow-hidden">
      {/* MAP */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* MOBILE OPEN BUTTON */}
      <Button
        onClick={handleOpenMobileMap}
        className="absolute bottom-4 right-4 z-10 px-3 py-2 shadow-md"
      >
        Mobil xaritada ochish
      </Button>
    </div>
  );
}
