import { useEffect, useRef, useState } from "react";

export function AnimatedTabs({ tabs, onChange }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label);
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  const handleChange = (label, value) => {
    setActiveTab(label); // ichki animatsiya uchun
    onChange?.(value); // parentga qiymat qaytaradi
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeTab) {
      const activeTabElement = activeTabRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft + 16;
        const clipRight = offsetLeft + offsetWidth + 16;

        container.style.clipPath = `inset(
          0
          ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}%
          0
          ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}%
          round 17px
        )`;
      }
    }
  }, [activeTab]);

  return (
    <div className="relative bg-secondary/50 border border-primary/10 mx-auto flex w-fit flex-col items-center rounded-full py-2 px-4">
      {/* Active layer */}
      <div
        ref={containerRef}
        className="absolute z-10 w-full overflow-hidden
        [clip-path:inset(0px_75%_0px_0%_round_17px)]
        [transition:clip-path_0.25s_ease]"
      >
        <div className="relative flex w-full justify-center bg-primary">
          {tabs.map((tab, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleChange(tab.label, tab.value)}
              className="flex h-8 items-center rounded-full p-3 text-sm font-medium text-primary-foreground"
              tabIndex={-1}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Normal layer */}
      <div className="relative flex w-full justify-center">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.label;

          return (
            <button
              key={index}
              ref={isActive ? activeTabRef : null}
              type="button"
              onClick={() => handleChange(tab.label, tab.value)}
              className="flex h-8 items-center cursor-pointer rounded-full p-3 text-sm font-medium text-muted-foreground"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
