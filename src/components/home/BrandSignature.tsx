import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const signatureWords = "A quiet signature, drawn from the lotus and carried through every thread.".split(" ");
const values = ["Grace", "Beauty", "Purity", "Heritage", "Refinement"];

export function BrandSignature() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 34,
      ease: "none",
      repeat: -1,
    });

    gsap.fromTo(
      ".brand-signature__statement span",
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".brand-signature__statement",
          start: "top 86%",
          end: "bottom 58%",
          scrub: 0.6,
        },
      },
    );

    gsap.utils.toArray<HTMLElement>(document.querySelectorAll(".editorial-card > img")).forEach((image) => {
      gsap.fromTo(
        image,
        { scale: 0.94, opacity: 0.82 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top 96%",
            end: "center 56%",
            scrub: 0.8,
          },
        },
      );
    });
  }, { scope: sectionRef });

  const sequence = Array.from({ length: 2 }, (_, sequenceIndex) => (
    <div className="brand-signature__sequence" key={sequenceIndex} aria-hidden="true">
      {values.map((value) => (
        <span className="brand-signature__value" key={`${sequenceIndex}-${value}`}>
          {value}
        </span>
      ))}
    </div>
  ));

  return (
    <section className="brand-signature" ref={sectionRef} aria-label="The Kallayani signature">
      <p className="sr-only">Kallayani values: {values.join(", ")}.</p>
      <div className="brand-signature__marquee" aria-hidden="true">
        <div className="brand-signature__track" ref={trackRef}>{sequence}</div>
      </div>
      <p className="brand-signature__statement shell">
        {signatureWords.map((word, index) => <span key={`${word}-${index}`}>{word}{" "}</span>)}
      </p>
    </section>
  );
}
