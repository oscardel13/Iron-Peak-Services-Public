"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

export default function HeroSection({
  display = "/assets/placeholder.jpg",
  slides = [],
  isVideo = false,
  onVideoPlay = () => {},
  intervalMs = 6000,
  children,
  videoPoster = "/assets/portfolio/video-thumbnail.jpg", // TODO: Fallback poster image for video!
  alt = "Iron Peak Services project hero background",
}) {
  // If slides are provided, use them. Otherwise fall back to single display image.
  const imageSlides = useMemo(
    () => (slides && slides.length > 0 ? slides : [display]),
    [slides, display],
  );

  const hasSlides = !isVideo && imageSlides.length > 1;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!hasSlides) return;

    const id = setInterval(() => {
      setIdx((i) => (i + 1) % imageSlides.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [hasSlides, imageSlides.length, intervalMs]);

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center shadow-lg overflow-hidden">
      {/* Background */}
      {isVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={display}
          autoPlay
          loop
          muted
          controls
          poster={videoPoster}
          playsInline
          preload="metadata"
          onPlay={onVideoPlay}
        />
      ) : hasSlides ? (
        <div className="absolute inset-0" aria-hidden="true">
          {imageSlides.map((src, i) => (
            <div
              key={src + i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority={i === 0} // first slide = LCP
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={imageSlides[0]}
            alt={alt}
            fill
            className="object-cover"
            priority
            loading="eager"
            sizes="100vw"
          />
        </div>
      )}

      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          isVideo ? "bg-black/40" : "bg-black/20"
        }`}
      />

      {/* Content */}
      <div className="relative z-10 py-32 md:py-48 px-4 text-center">
        {children}
      </div>
    </section>
  );
}
