import { Button } from "@/components/ui/button";
import { useObyektPostLocationsMutation } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function YandexMapOptimized() {
  const navigate = useNavigate();
  const [addLocations, { isLoading }] = useObyektPostLocationsMutation();
  const mapRef = useRef(null); // map instance
  const placemarkRef = useRef(null); // marker
  const mapContainerRef = useRef(null);
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  useEffect(() => {
    if (!window.ymaps) return;
    if (mapRef.current) return; // ❗ map qayta init bo‘lmasin
    window.ymaps.ready(() => {
      const map = new window.ymaps.Map(mapContainerRef.current, {
        center: [41.2995, 69.2401],
        zoom: 12,
      });

      mapRef.current = map;

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
          obyekt: Number(id),
        };

        setLocation(data);
      });
    });

    // cleanup (route change bo‘lsa)
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [id]);

  const handleSave = () => {
    if (!location) {
      toast.warning("Avval xaritadan joy tanlang");
      return;
    }
    try {
      addLocations({ body: location });
      toast.success("Joylashuv muvaffaqiyatli saqlandi");
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full h-[400px] rounded-md overflow-hidden ">
      {/* MAP */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* SAVE BUTTON (xalaqit bermaydi) */}
      <Button
        onClick={handleSave}
        className="absolute bottom-4 right-4 z-10 text-white px-4 py-2 rounded-md shadow-lg"
      >
        {isLoading ? "Saqlanmoqda..." : "Joylashuvni saqlash"}
      </Button>
    </div>
  );
}
