import { NotFound } from "@/components/ui/ghost-404-page";

export default function Error401() {
  return (
    <div className="min-h-screen w-full bg-white">
      <NotFound />
    </div>
  );
}
