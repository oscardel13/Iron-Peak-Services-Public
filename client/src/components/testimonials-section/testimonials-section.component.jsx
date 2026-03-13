"use client";

import { useState, useEffect, useRef } from "react";
import METADATA from "@/data/data";
import Image from "next/image";
import Link from "next/link";
import Popover from "../popover/popover.component";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);

  const testimonials = METADATA.testimonials;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  // check if text is clamped
  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [currentTestimonial]);

  const scrollLeft = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const scrollRight = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Remove this when testimonials are added
  return null;

  return (
    <section className="w-screen pb-25 relative overflow-hidden">
      <div className="flex justify-end w-full h-[750px] lg:h-[450px]">
        <div className="flex flex-col pb-5 gap-6 lg:flex-row w-full xl:w-[1536px] 2xl:w-[1650px]">
          {/* Left side (text + card) */}
          <div className="relative z-30 w-full lg:w-1/4 h-min pl-10">
            <div className="flex flex-row h-min items-center gap-3 py-1">
              <div className="w-10 h-0.5 bg-brand-text-primary" />
              <h3 className="text-gray-700 font-bold">TESTIMONIALS</h3>
            </div>
            <div className="max-w-xl mt-5">
              <h2 className="text-2xl lg:text-4xl font-semibold text-brand-primary ">
                WHAT OUR CLIENTS ARE SAYING
              </h2>
            </div>

            {/* White Card */}
            <div
              className="
                absolute 
                z-30
                left-1/2 top-100 sm:top-120 lg:top-55
                w-[90%] max-w-lg
                lg:w-xl
                lg:max-w-xl 
                -translate-x-1/2
                lg:left-0 lg:top-50
                lg:translate-x-0
              "
            >
              <div className="relative flex flex-col items-center bg-white p-9 gap-5 shadow-lg w-full h-[400px] sm:h-[300px] transition-all duration-500">
                <div className="flex flex-col gap-5">
                  {/* Clickable Quote */}
                  <p
                    ref={textRef}
                    className="text-md text-black text-xl line-clamp-7 sm:line-clamp-3 cursor-pointer hover:text-brand-primary transition"
                    onClick={() => setExpanded(true)}
                  >
                    "{currentTestimonial.quote}"
                  </p>

                  {isClamped && (
                    <span
                      className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                      onClick={() => setExpanded(true)}
                    >
                      Read More →
                    </span>
                  )}

                  <div className="flex flex-row">
                    <div className="flex flex-col gap-1 w-4/6">
                      <span className="text-black">
                        {currentTestimonial.name}
                      </span>
                      <span className="text-gray-700">
                        {currentTestimonial.title}
                      </span>
                    </div>
                    <Link
                      href="/contact"
                      className="flex justify-center items-center w-40 h-14 bg-brand-primary hover:bg-brand-primary-hover shadow-lg rounded-lg font-semibold text-white"
                    >
                      LET'S CHAT
                    </Link>
                  </div>
                </div>

                {/* Dots Navigation */}
                <div className="flex absolute -bottom-10 justify-center justify-self-end gap-5 mb-15 ">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                        idx === currentIndex
                          ? "bg-brand-primary"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Left Arrow (lg+) */}
                <button
                  onClick={scrollLeft}
                  className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 text-white bg-brand-primary hover:bg-brand-primary-hover justify-center items-center h-10 w-10 border p-2 rounded-full hover:shadow-xl font-bold"
                >
                  &lt;
                </button>

                {/* Right Arrow (lg+) */}
                <button
                  onClick={scrollRight}
                  className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 text-white bg-brand-primary hover:bg-brand-primary-hover justify-center items-center h-10 w-10 border p-2 rounded-full hover:shadow-xl font-bold"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Right side (image) */}
          <div className="relative w-full lg:w-3/4 z-10 h-full">
            <Image
              src={
                currentTestimonial.projectHero ||
                "/assets/about/Family_Portrait.jpg"
              }
              alt={currentTestimonial.name}
              fill
              className="object-cover transition-all duration-500 delay-1000"
            />
          </div>
        </div>
      </div>

      {/* Popover for expanded testimonial */}
      {expanded && (
        <Popover closeTrigger={() => setExpanded(false)}>
          <div className="relative bg-white shadow-lg rounded-md max-w-2xl mx-auto p-10">
            <p className="text-lg text-gray-800 mb-6">
              "{currentTestimonial.quote}"
            </p>
            <div className="flex flex-col gap-1 mb-6">
              <span className="text-black font-semibold">
                {currentTestimonial.name}
              </span>
              <span className="text-gray-700">{currentTestimonial.title}</span>
            </div>

            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              className="absolute -left-5 top-1/2 -translate-y-1/2 text-white bg-brand-primary hover:bg-brand-primary-hover justify-center items-center h-10 w-10 border p-2 rounded-full hover:shadow-xl font-bold"
            >
              &lt;
            </button>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              className="absolute -right-5 top-1/2 -translate-y-1/2 text-white bg-brand-primary hover:bg-brand-primary-hover justify-center items-center h-10 w-10 border p-2 rounded-full hover:shadow-xl font-bold"
            >
              &gt;
            </button>

            <button
              onClick={() => setExpanded(false)}
              className="absolute top-0 right-0 m-4 font-thin text-gray-700 text-4xl hover:text-brand-primary"
            >
              &times;
            </button>
          </div>
        </Popover>
      )}
    </section>
  );
}
