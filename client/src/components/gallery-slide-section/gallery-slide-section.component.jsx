"use client";

import Image from "next/image";
import ScrollContainer from "../scrolling-container/scrolling-container.component";
import METADATA from "@/data/data";

export default function GallerySection() {
  const images = METADATA.gallery || [];

  return (
    <section className="flex flex-col items-center md:px-16 w-screen p-5 py-10">
      <div className="w-full max-w-[1480px]">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row h-full items-center w-1/2 gap-3 py-1">
            <div className="w-10 h-0.5 bg-brand-text-primary" />
            <h3 className="text-gray-700 font-bold">GALLERY</h3>
          </div>
        </div>

        <ScrollContainer>
          {images.map((src, i) => (
            <div key={i} className="min-w-[280px] md:min-w-[350px]">
              <Image
                src={src}
                alt={`Project image ${i + 1}`}
                width={350}
                height={250}
                loading="lazy"
                className="rounded-lg object-cover shadow-md hover:scale-[1.03] transition-transform duration-200"
              />
            </div>
          ))}
        </ScrollContainer>
      </div>
    </section>
  );
}
