"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="relative group max-w-96 flex flex-col bg-white shadow-lg overflow-hidden hover:cursor-pointer"
    >
      {/* Image */}
      <div className="relative">
        <Image
          src={project.heroImage}
          alt={project.name}
          width={400}
          height={300}
          className="object-cover h-[400px] w-full"
        />

        {/* Overlay button (lg and up only) */}
        <div
          className="hidden lg:flex absolute bottom-0 left-0 w-full justify-center
          opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-500 ease-in-out"
        >
          <button className="m-5 py-4 px-10 bg-brand-primary hover:bg-brand-primary-hover rounded-xl text-xl font-semibold text-white shadow-lg hover:cursor-pointer">
            VIEW PROJECT
          </button>
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-col w-full p-7 gap-3 h-72 lg:h-48">
        <span className="w-full text-lg font-semibold text-brand-primary break-words">
          {project.type}
        </span>
        <h3 className="w-full text-black font-semibold text-xl break-words">
          {project.name}
        </h3>
        <span className="w-full text-gray-700 text-lg font-medium break-words">
          {project.location}
        </span>

        {/* Always visible button on small/medium screens */}
        <div className="lg:hidden py-5">
          <button className="flex py-5 px-10 bg-brand-primary hover:bg-brand-primary-hover rounded-xl text-lg font-semibold text-white">
            VIEW PROJECT
          </button>
        </div>
      </div>
    </Link>
  );
}
