import { useEffect, useRef, useState } from "react";

export default function AnimatedDot() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`w-4 h-4 rounded-full border-4 border-white
        transition-all duration-500
        ${active ? "bg-blue-900 scale-100 opacity-100" : "bg-gray-300 scale-50 opacity-40"}
      `}
    />
  );
}
