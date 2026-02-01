"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const HermesScene = dynamic(() => import("./HermesScene"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(165deg, #15182a 0%, #212E50 100%)" }}
    >
      <span className="text-creme/80 text-sm">Chargement…</span>
    </div>
  ),
});

interface Rubrique {
  id: string;
  title: string;
}

interface HermesSectionProps {
  children?: React.ReactNode;
  rubriques?: Rubrique[];
}

export default function HermesSection({ children, rubriques = [] }: HermesSectionProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const half = Math.ceil(rubriques.length / 2);
  const rubriquesLeft = useMemo(() => rubriques.slice(0, half), [rubriques, half]);
  const rubriquesRight = useMemo(() => rubriques.slice(half), [rubriques, half]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const progressPx = -rect.top;
      const clamped = Math.max(0, Math.min(progressPx, sectionHeight));
      const progress = sectionHeight > 0 ? clamped / sectionHeight : 0;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollOffset = scrollProgress * 80;

  return (
    <section
      ref={sectionRef}
      style={{ height: "700vh", position: "relative" }}
    >
      {/* Statue 3D centrée + rubriques sur les côtés + titre, sticky pendant le scroll */}
      <div
        className="sticky top-0 left-0 w-full h-screen flex flex-row items-stretch"
        style={{
          minHeight: "100vh",
          zIndex: 0,
          background: "linear-gradient(165deg, #15182a 0%, #1a1f38 35%, #212E50 70%, #161b2e 100%)",
          paddingTop: "5rem",
          paddingBottom: "2rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        {/* Rubriques à gauche — boutons learn-more, répartis sur l'écran */}
        <div className="hidden lg:flex flex-col justify-center items-end w-72 xl:w-80 2xl:w-96 flex-shrink-0 py-4 px-2">
          <div
            className="flex flex-col gap-8 xl:gap-10"
            style={{ transform: `translateY(${scrollOffset}px)` }}
          >
            {rubriquesLeft.map((r) => (
              <Link
                key={r.id}
                href={`/rubriques/${r.id}`}
                className="hermes-learn-more font-heading"
              >
                <span className="hermes-circle">
                  <span className="hermes-icon-arrow" />
                </span>
                <span className="hermes-button-text">{r.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Centre : modèle 3D + titre */}
        <div className="flex-1 min-w-0 flex flex-col items-center justify-between">
          <div className="flex-1 w-full min-h-0 flex items-center justify-center" aria-hidden>
            <HermesScene scrollProgress={scrollProgress} />
          </div>
          {/* Titre Collection Aur'art — juste sous la statue, visible dès l'arrivée */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3 mt-3 md:mt-5 mb-2">
            <div className="relative flex h-16 w-16 md:h-20 md:w-20 flex-shrink-0 items-center justify-center rounded-full overflow-hidden bg-creme/95 shadow-lg ring-2 ring-creme/30">
              <Image
                src="/images/logo icone.jpeg"
                alt=""
                width={80}
                height={80}
                className="object-contain p-1.5"
              />
            </div>
            <span className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-creme">
              Collection Aur&apos;art
            </span>
            <span className="text-sm md:text-base font-medium uppercase tracking-[0.2em] text-creme/85">
              Esquisses de l&apos;Art & son marché
            </span>
          </div>
        </div>

        {/* Rubriques à droite — boutons learn-more, répartis sur l'écran */}
        <div className="hidden lg:flex flex-col justify-center items-start w-72 xl:w-80 2xl:w-96 flex-shrink-0 py-4 px-2">
          <div
            className="flex flex-col gap-8 xl:gap-10"
            style={{ transform: `translateY(${-scrollOffset}px)` }}
          >
            {rubriquesRight.map((r) => (
              <Link
                key={r.id}
                href={`/rubriques/${r.id}`}
                className="hermes-learn-more font-heading"
              >
                <span className="hermes-circle">
                  <span className="hermes-icon-arrow" />
                </span>
                <span className="hermes-button-text">{r.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Espace vide : statue tourne 180° avant que la bande blanche et la suite n'apparaissent */}
      <div className="relative z-10 pointer-events-none" style={{ minHeight: "250vh" }} aria-hidden />
      {/* Contenu (bande blanche, suite de la page) — n'entre en vue qu'après 180° de rotation */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">{children}</div>
      </div>

      <style jsx global>{`
        .hermes-learn-more {
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          outline: none;
          border: 0;
          vertical-align: middle;
          text-decoration: none;
          background: transparent;
          padding: 0;
          font-size: inherit;
          font-family: inherit;
          width: 20rem;
          height: auto;
        }
        .hermes-learn-more .hermes-circle {
          transition: width 0.65s cubic-bezier(0.65, 0, 0.076, 1);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 1rem;
          margin: 0;
          width: 4rem;
          height: 4rem;
          min-width: 4rem;
          min-height: 4rem;
          background: #212E50;
          border-radius: 2rem;
          flex-shrink: 0;
          z-index: 0;
        }
        .hermes-learn-more .hermes-circle .hermes-icon-arrow {
          transition: transform 0.65s cubic-bezier(0.65, 0, 0.076, 1), background 0.65s ease;
          position: relative;
          left: 0;
          width: 1.25rem;
          height: 0.125rem;
          background: none;
          flex-shrink: 0;
        }
        .hermes-learn-more .hermes-circle .hermes-icon-arrow::before {
          position: absolute;
          content: "";
          top: -0.35rem;
          right: 0.0625rem;
          width: 0.75rem;
          height: 0.75rem;
          border-top: 0.125rem solid #F8F8F0;
          border-right: 0.125rem solid #F8F8F0;
          transform: rotate(45deg);
        }
        .hermes-learn-more .hermes-button-text {
          transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 5.5rem;
          right: 0;
          padding: 0;
          margin: 0;
          color: #F8F8F0;
          font-weight: 700;
          line-height: 1.2;
          text-align: left;
          text-transform: uppercase;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          z-index: 1;
          pointer-events: none;
        }
        .hermes-learn-more {
          min-height: 4rem;
          align-items: center;
        }
        .hermes-learn-more:hover .hermes-circle {
          width: 100%;
        }
        .hermes-learn-more:hover .hermes-circle .hermes-icon-arrow {
          background: #F8F8F0;
          transform: translate(1.75rem, 0);
        }
        .hermes-learn-more:hover .hermes-button-text {
          color: #F8F8F0;
        }
      `}</style>
    </section>
  );
}
