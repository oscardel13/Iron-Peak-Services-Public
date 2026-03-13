import ScrollContainer from "@/components/scrolling-container/scrolling-container.component";
import TeamMemberCard from "@/components/team-member-card/team-member-card.component";

import METADATA from "@/data/data";

export default function TeamSection() {
  return (
    <section className="px-5 md:px-20 lg:px-40 xl:px-72 w-screen p-5 py-16 lg:py-20">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row h-full items-center gap-3 py-1">
          <div className="w-10 h-0.5 bg-brand-text-primary" />
          <h3 className="text-gray-700 font-bold">OUR TEAM</h3>
        </div>
      </div>

      <ScrollContainer arrow_position="top">
        {METADATA.team.map((member, idx) => (
          <TeamMemberCard member={member} key={idx} />
        ))}
      </ScrollContainer>
    </section>
  );
}
