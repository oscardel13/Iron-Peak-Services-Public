import { useRef } from "react";
import DayCard from "../day-card/day-card.component";
import ScollContainer from "../scrolling-container/scrolling-container.component";

// ADD WAY TO SCROLL BY DRAGGING
// MODULIZE THE SCROLLING PART AS ITS USED IN TIME SECTION TOO

const DaysSection = ({ selectedDate, updateSelectedDate, availability }) => {
  /*
  Ideally we want to get this day by the dates present. so if 30, 31, 1, 2 , 3 it will print November - December. so
  so we need first day (27) and if the first visible day is greater or equal to (days in current month - 5) 
  to display the between and if its 1 display next month. we can do better if we can get how many days are visible
  take into consideration the year too
  */

  return (
    <div className="pt-3">
      <h3 className="w-full text-cente text-3xl font-semibold">
        {`${selectedDate.month} ${selectedDate.year}`}
      </h3>
      <ScollContainer>
        {availability.map((day, index) => (
          <DayCard
            key={index}
            date={day.date}
            selectedDate={selectedDate}
            updateSelectedDate={updateSelectedDate}
            openSlots={day.slots.length}
          />
        ))}
      </ScollContainer>
    </div>
  );
};

export default DaysSection;
