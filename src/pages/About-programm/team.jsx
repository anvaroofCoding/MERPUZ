import ChromaGrid from "@/components/ChromaGrid";

export default function Team() {
  const items = [
    {
      image: "/4.jpg",
      title: "Mirxusanov Mirxokim",
      subtitle: "Dastur asoschisi",
      handle: "#1",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "https://github.com/sarahjohnson",
    },
    {
      image: "/xizmat.png",
      title: "Toshpulatov Feruz",
      subtitle: "Loyha rahbari",
      handle: "@feruz",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)",
      url: "https://linkedin.com/in/mikechen",
    },
    {
      image: "/Islom.jpg",
      title: "Islom Anvarov",
      subtitle: "Frontend Engineer",
      handle: "@isamu_web",
      borderColor: "#10aeb9ff",
      gradient: "linear-gradient(180deg, #108cb9ff, #000)",
      url: "https://linkedin.com/in/mikechen",
    },
    {
      image: "/sunnatchik.jpg",
      title: "Savriyev Sunnat",
      subtitle: "Backend Engineer",
      handle: "@sunnat",
      borderColor: "#1ce154ff",
      gradient: "linear-gradient(180deg, #43b910ff, #000)",
      url: "https://linkedin.com/in/mikechen",
    },
  ];
  return (
      <ChromaGrid
        items={items}
        radius={300}
        damping={0.45}
        fadeOut={0.6}
        ease="power3.out"
      />
  );
}
