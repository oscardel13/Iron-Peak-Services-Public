import { useRef } from "react";

// ADD WAY TO SCROLL BY DRAGGING

const ScollContainer = ({ children }) => {
  const scrollContainerRef = useRef(null);

  // Scroll functions
  const scrollLeft = () => {
    const childWidth = scrollContainerRef.current.offsetWidth + 8; // Add gap
    scrollContainerRef.current.scrollBy({
      left: -childWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const childWidth = scrollContainerRef.current.offsetWidth + 8; // Add gap
    scrollContainerRef.current.scrollBy({
      left: childWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="py-1 md:py-3">
      <div className="flex flex-row py-2 md:py-3">
        {/* Left Scroll Button */}
        <div className="hidden justify-center items-center pr-2 sm:flex sm:w-1/6">
          <button
            onClick={scrollLeft}
            className="flex justify-center items-center h-3 w-3 border p-5 rounded-full hover:shadow-xl font-bold"
          >
            &lt;
          </button>
        </div>

        {/* Scrollable Days Section */}
        <div
          ref={scrollContainerRef}
          className="flex flex-row sm:w-4/6 gap-2 py-4 overflow-auto invisible-scrollbar"
        >
          {children}
        </div>

        {/* Right Scroll Button */}
        <div className="hidden justify-center items-center pl-2 sm:flex sm:w-1/6">
          <button
            onClick={scrollRight}
            className="flex justify-center items-center h-3 w-3 border p-5 rounded-full hover:shadow-xl font-bold"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScollContainer;
