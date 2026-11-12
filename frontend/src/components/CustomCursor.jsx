import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device supports hover (desktop)
    if (window.matchMedia("(hover: none)").matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });
      setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".skill-card") ||
        target.closest(".project-card") ||
        target.closest("input") ||
        target.closest("textarea")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth lerp loop for the outer ring
    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setTrail({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={isHovered ? "cursor-hover" : ""}>
      {/* Central glowing dot */}
      <div
        className="custom-cursor-dot"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Outer interactive ring */}
      <div
        className="custom-cursor-ring"
        style={{ left: `${trail.x}px`, top: `${trail.y}px` }}
      />
    </div>
  );
}
