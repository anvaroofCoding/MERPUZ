import {
  Particles,
  ParticlesEffect,
} from "@/components/animate-ui/primitives/effects/particles";
import PillNav from "@/components/PillNav";
import { AuroraText } from "@/components/ui/aurora-text";
import { Meteors } from "@/components/ui/meteors";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useState } from "react";
import Team from "./team";

export default function Programm(props) {
  const [effects, setEffects] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setEffects((prev) => [...prev, { id: Date.now(), x, y }]);

    // 1.5 sekunddan keyin o‘chadi
    setTimeout(() => {
      setEffects((prev) => prev.slice(1));
    }, 1500);
  };

  return (
    <div
      onClick={handleClick}
      className="relative min-h-screen w-full overflow-hidden bg-black cursor-pointer"
    >
      <Particles>
        {/* CLICK EFFECTLAR */}
        {effects.map((effect) => (
          <ParticlesEffect
            key={effect.id}
            className="absolute bg-cyan-400 size-2 rounded-full"
            style={{
              left: effect.x,
              top: effect.y,
            }}
            {...props}
          />
        ))}

        {/* DECOR */}
        <Meteors number={30} />
      </Particles>
      <div className="flex justify-center items-cebter">
        <PillNav
          logo="/logos.png"
          logoAlt="Company Logo"
          items={[
            { label: "Jamoa", href: "#team" },
            { label: "Dastur haqida", href: "#about" },
            { label: "Yaratilishi", href: "/created" },
            { label: "Contact", href: "/contact" },
          ]}
          className="custom-nav"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </div>
      {/* TEXT */}
      {/* <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white to-gray-400/60 bg-clip-text text-center text-8xl font-semibold text-transparent">
        PPR dasturi haqida
      </span> */}
      <div className="w-full h-screen flex justify-center items-center flex-col gap-10">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-8xl lg:w-2/4 text-center text-white">
          <AuroraText>PPR </AuroraText> Dasturi haqida batafsil bilib oling
        </h1>
        <RainbowButton className="text-black">
          Dastur bilan tanishish
        </RainbowButton>
      </div>
      <div className="bg-black min-h-screen w-full container" id="team">
        <h1 className="text-xl leading-none font-semibold tracking-tighter text-balance sm:text-2xl md:text-4xl lg:text-5xl mb-15 text-center text-white">
          Dasturni ishlab chiqishda ishtirok etgan jamoa
        </h1>
        <Team />
      </div>
    </div>
  );
}
