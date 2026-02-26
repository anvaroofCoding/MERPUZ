import { useEffect, useRef } from "react";

function throttle(fn, delay) {
  let lastCall = 0;

  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

export default function Counter() {
  const throttleRef = useRef(null);

  useEffect(() => {
    throttleRef.current = throttle(() => {
      console.log("Scroll event");
    }, 300);

    const handleScroll = () => {
      throttleRef.current();
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div style={{ height: "200vh" }}>Scroll me</div>;
}
