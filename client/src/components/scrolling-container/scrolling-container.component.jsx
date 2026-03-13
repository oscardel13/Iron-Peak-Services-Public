"use client";

import { useRef } from "react";

const POSITIONS = {
  top: {
    left: "-top-10 right-20",
    right: "-top-10 right-5",
  },
  middle: {
    left: "-left-10 top-65",
    right: "-right-10 top-65",
  },
};

export default function ScrollContainer({
  children,
  arrow_position = "middle",
}) {
  const scrollContainerRef = useRef(null);

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const child = scrollContainerRef.current.firstChild;
    if (!child) return;
    const childWidth = child.offsetWidth; // width + gap
    scrollContainerRef.current.scrollBy({
      left: -childWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const child = scrollContainerRef.current.firstChild;
    if (!child) return;
    const childWidth = child.offsetWidth; // width + gap
    scrollContainerRef.current.scrollBy({
      left: childWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-row w-full py-2 md:py-3">
        {/* Left Scroll Button */}
        <div
          className={`hidden absolute md:block z-10 ${POSITIONS[arrow_position]["left"]}`}
        >
          <button
            onClick={scrollLeft}
            className="flex text-white bg-brand-primary hover:bg-brand-primary-hover hover:cursor-pointer justify-center items-center h-3 w-3 border p-5 rounded-full hover:shadow-xl font-bold lg:scale-125"
          >
            &lt;
          </button>
        </div>

        {/* Scrollable Section with snap */}
        <div
          ref={scrollContainerRef}
          className="flex flex-row w-full gap-10 py-4 overflow-x-auto invisible-scrollbar snap-x snap-mandatory"
        >
          {Array.isArray(children)
            ? children.map((child, i) => (
                <div key={i} className="snap-start flex-shrink-0 {xl:w-1/4}">
                  {child}
                </div>
              ))
            : children}
        </div>

        {/* Right Scroll Button */}
        <div
          className={`hidden absolute md:block ${POSITIONS[arrow_position]["right"]}`}
        >
          <button
            onClick={scrollRight}
            className="flex text-white bg-brand-primary hover:bg-brand-primary-hover hover:cursor-pointer justify-center items-center h-3 w-3 border p-5 rounded-full hover:shadow-xl font-bold lg:scale-125"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
