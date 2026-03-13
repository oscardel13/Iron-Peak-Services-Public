"use client";

import Image from "next/image";
import Link from "next/link";

export default function DumpsterCard({ size, description, path, image }) {
  console.log("Rendering DumpsterCard with props:", {
    size,
    description,
    path,
  });
  return (
    <div className="relative flex flex-col flex-shrink-0 rounded-2xl shadow-md overflow-hidden w-full min-w-[280px] h-130 bg-alabaster-grey snap-start">
      <Image
        src={image}
        alt="Dumpster Sizes"
        width={300}
        height={200}
        className="rounded-t-lg w-full h-48 object-cover"
      />
      <div className="flex flex-col gap-5 p-5 text-gray-600 text-center">
        <h6 className="text-center text-xl font-semibold text-gray-700">
          {size}
        </h6>
        <p>{description}</p>
      </div>
       <div className="absolute bottom-4 px-5 w-full">
        <Link
          href={path}
          className="block w-full px-6 py-3 bg-brand-primary text-white text-center font-semibold rounded-lg hover:bg-brand-primary-hover transition"
        >
          {size}
        </Link>
       </div>
    </div>
  );
}
