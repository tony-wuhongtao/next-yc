"use client";
import { useEffect } from "react";
import gsap from "gsap";

export default function Home() {
  useEffect(() => {
    const tl = gsap
      .timeline({
        defaults: {
          duration: 2,
          yoyo: true,
          ease: "power2.inOut",
        },
      })
      .fromTo(
        ".left, .right",
        {
          svgOrigin: "640 500",
          skewY: (i) => [-30, 15][i],
          scaleX: (i) => [0.6, 0.85][i],
          x: 200,
        },
        {
          skewY: (i) => [-15, 30][i],
          scaleX: (i) => [0.85, 0.6][i],
          x: -200,
        }
      )
      .play(0.5);

    const tl2 = gsap.timeline();

    document.querySelectorAll("text").forEach((t, i) => {
      tl2.add(
        gsap.fromTo(
          t,
          {
            xPercent: -100,
            x: 700,
          },
          {
            duration: 1,
            xPercent: 0,
            x: 575,
            ease: "sine.inOut",
          }
        ),
        (i % 3) * 0.2
      );
    });

    const handlePointerMove = (e: PointerEvent) => {
      tl.pause();
      tl2.pause();
      gsap.to([tl, tl2], {
        duration: 2,
        ease: "power4",
        progress: e.x / window.innerWidth,
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 900,
        background: "#000",
        overflow: "hidden",
      }}
    >
      <svg style={{ width: "100%", height: "100vh" }} viewBox="0 0 1280 720">
        <mask id="maskLeft">
          <rect x="-50%" width="100%" height="100%" fill="#fff" />
        </mask>
        <mask id="maskRight">
          <rect x="50%" width="100%" height="100%" fill="#fff" />
        </mask>
        <g fontSize="150">
          <g mask="url(#maskLeft)" fill="#fff" className="left">
            <text y="120">耀乘科技</text>
            <text y="250">Bright Multiply</text>
            <text y="380">B X Excellence</text>
          </g>
          <g mask="url(#maskRight)" fill="#aaa" className="right">
            <text y="120">耀乘科技</text>
            <text y="250">Bright Multiply</text>
            <text y="380">B X Excellence</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
