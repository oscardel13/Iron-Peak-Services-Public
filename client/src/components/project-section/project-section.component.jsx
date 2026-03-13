"use client";

import Link from "next/link";
import ProjectCard from "../project_card/project_card.component";
import ScrollContainer from "../scrolling-container/scrolling-container.component";
import METADATA from "@/data/data";

export default function ProjectSection() {
  const featuredProjects = METADATA.featuredProjects; // new field

  return (
    <section className="flex flex-col items-center md:px-16 w-screen p-5 py-10">
      <div className="w-full max-w-[1480px]">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row h-full items-center w-1/2 gap-3 py-1">
            <div className="w-10 h-0.5 bg-brand-text-primary" />
            <h3 className="text-gray-700 font-bold">FEATURED PROJECTS</h3>
          </div>
          <div className="flex flex-row h-full w-1/2 items-center justify-center gap-3 py-1 ">
            <Link
              href="/portfolio"
              className="text-gray-500 font-bold text-break w-full text-end hover:cursor-pointer hover:text-gray-400"
            >
              View Our Work
            </Link>
          </div>
        </div>

        <ScrollContainer>
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ScrollContainer>
      </div>
    </section>
  );
}
