import { WifiOff } from "lucide-react";

export default function OfflineOverlay() {
  return (
    <div
      className="
        fixed inset-0 z-[99999]
        bg-black/70
        backdrop-blur-md
        flex items-center justify-center
        pointer-events-auto
      "
    >
      <div className="text-center text-white px-6">
        <WifiOff size={72} className="mx-auto mb-6 text-red-500" />
        <h1 className="text-2xl font-bold mb-2">Internet aloqasi yo‘q</h1>
        <p className="text-sm text-gray-300">
          Internetga ulanmagansiz. Ulanish tiklangach davom etadi.
        </p>
      </div>
    </div>
  );
}
