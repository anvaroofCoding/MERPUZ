import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/badge";
import { Image } from "antd";
import { Button } from "./ui/button";
import { CloudDownload, X } from "lucide-react";

export function UniqueAccordion({ items }) {
  const [activeId, setActiveId] = useState("design");
  const [hoveredId, setHoveredId] = useState(null);

  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileUrl.split("/").pop();

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-0">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          const isLast = index === items.length - 1;

          return (
            <div key={item.id}>
              <motion.button
                onClick={() => setActiveId(isActive ? null : item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="w-full group relative"
                initial={false}
              >
                <div className="flex items-center gap-6 py-5 px-1">
                  {/* Number with animated circle */}
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-foreground"
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : isHovered ? 0.85 : 0,
                        opacity: isActive ? 1 : isHovered ? 0.1 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                    <motion.span
                      className="relative z-10 text-sm font-medium tracking-wide"
                      animate={{
                        color: isActive
                          ? "var(--primary-foreground)"
                          : "var(--muted-foreground)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {index + 1}
                    </motion.span>
                  </div>

                  {/* Title */}
                  <motion.h3
                    className="text-2xl font-medium tracking-tight"
                    animate={{
                      x: isActive || isHovered ? 4 : 0,
                      color: isActive
                        ? "var(--foreground)"
                        : isHovered
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    {(() => {
                      const d = new Date(item?.created_at);
                      const date = d.toLocaleDateString("uz-UZ");
                      const time = d.toLocaleTimeString("uz-UZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      });
                      return `${date} ${time}`;
                    })()}
                  </motion.h3>

                  {/* Animated indicator */}
                  <div className="ml-auto flex items-center gap-3">
                    <motion.div
                      className="flex items-center justify-center w-8 h-8"
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-foreground"
                        animate={{
                          opacity: isActive || isHovered ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.path
                          d="M8 1V15M1 8H15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          initial={false}
                        />
                      </motion.svg>
                    </motion.div>
                  </div>
                </div>

                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-border origin-left"
                  initial={false}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-foreground origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: isActive ? 1 : isHovered ? 0.3 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              </motion.button>
              {/* Content */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.1 },
                      },
                    }}
                    className="overflow-hidden "
                  >
                    <div className="flex items-center justify-between mt-5">
                      <div className="flex gap-2">
                        {item?.bajarilgan_obyektlar_nomi.map((ix) => {
                          return <Badge key={ix}>{ix}</Badge>;
                        })}
                      </div>
                      <div className="flex gap-3 items-center">
                        <p className="pt">Yaratuvchi: {item?.user}</p>
                        {item?.file ? (
                          <Button
                            size="sm"
                            onClick={() => handleDownload(item.file)}
                          >
                            Fayl yuklash
                            <CloudDownload size={15} className="ml-2" />
                          </Button>
                        ) : (
                          <Button size="sm" disabled>
                            Fayl mavjud emas
                            <X size={15} className="ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <motion.p
                      className="pl-16 pr-12 py-6 text-muted-foreground leading-relaxed"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      exit={{ y: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      {item?.comment}
                    </motion.p>

                    <div className="flex flex-row flex-wrap gap-2">
                      {item?.images?.map((ix) => {
                        return (
                          <Image
                            width={150}
                            alt={item.comment}
                            src={ix.image}
                          />
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
