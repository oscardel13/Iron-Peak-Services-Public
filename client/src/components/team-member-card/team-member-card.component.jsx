import Image from "next/image";
import { useState } from "react";
import Popover from "../popover/popover.component";

export default function TeamMemberCard({ children, member }) {
  const [memberExpanded, setMemberExpanded] = useState(false);

  function ToggleMemberExpanded() {
    setMemberExpanded((past) => !past);
  }
  return (
    <div>
      {memberExpanded && (
        <Popover closeTrigger={ToggleMemberExpanded}>
          <div className="relative bg-white shadow-lg rounded-md max-w-screen rounded-lg">
            <div className="flex flex-col lg:flex-row">
              <Image
                src={`${member.img}`}
                alt="Project Image"
                width={400}
                height={800}
                className="object-fill hidden lg:block rounded-l-md"
              />
              <div className="flex flex-col gap-5 max-w-96 py-10 px-7">
                <div className="flex flex-col w-full">
                  <h3 className="w-full text-black font-semibold text-2xl break-words">
                    {member.name}
                  </h3>
                  <span className="text-gray-600 text-lg font-semibold break-words">
                    {member.title}
                  </span>
                </div>
                <p className="text-gray-700 text-lg">{member.description}</p>
              </div>
            </div>
            <button
              onClick={ToggleMemberExpanded}
              className="absolute top-0 right-3 m-4 font-thin text-gray-700 text-4xl hover:text-brand-primary"
            >
              &times;
            </button>
          </div>
        </Popover>
      )}

      <div
        onClick={ToggleMemberExpanded}
        className="relative group flex flex-col bg-white shadow-lg h-full max-w-80 hover:cursor-pointer"
      >
        {/* Image */}
        <div className="relative">
          <Image
            src={`${member.img}`}
            alt="Project Image"
            width={500}
            height={400}
            className="object-fill"
          />

          {/* Overlay button (lg and up only) */}
          <div
            className="hidden flex absolute bottom-0 left-0 w-full justify-center
                  opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-500 ease-in-out"
          ></div>
        </div>

        {/* Card content */}
        <div className="flex flex-col w-full p-7 gap-2">
          <h3 className="w-full text-black font-semibold text-2xl break-words">
            {member.name}
          </h3>
          <span className="w-full text-gray-600 text-lg font-semibold break-words">
            {member.title}
          </span>
        </div>
      </div>
    </div>
  );
}
