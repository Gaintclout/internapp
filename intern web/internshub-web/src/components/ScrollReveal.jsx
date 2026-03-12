import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ children, delay = 0, from = "up" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const dir =
    from === "left"
      ? "-translate-x-12"
      : from === "right"
      ? "translate-x-12"
      : "translate-y-12";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out
        ${show ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${dir}`}
      `}
    >
      {children}
    </div>
  );
}
