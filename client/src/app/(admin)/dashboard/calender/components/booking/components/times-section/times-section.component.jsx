import { useEffect, useState } from "react";
import ScollContainer from "../scrolling-container/scrolling-container.component";
import { formatTime } from "../../../../utils/helper-functions";

const TimeSection = ({ slots, selectedTime, updateSelectedTime }) => {
  const [partOfDay, setPartOfDay] = useState("Morning");

  const now = new Date();

  const onClick = (time) => {
    setPartOfDay(time);
    updateSelectedTime(groupedSlots[time][0]);
  };

  const filteredSlots = slots.filter((slot) => {
    const [datePart, timePart] = slot.split(" ");
    const slotDateTime = new Date(`${datePart}T${timePart}`);
    return slotDateTime >= now;
  });

  // Group slots into morning, afternoon, and evening
  const groupedSlots = {
    Morning: slots
      .filter((slot) => {
        const time = slot.split(" ")[1]; // Extract the time portion (e.g., "08:00")
        return parseInt(time.split(":")[0]) < 12;
      })
      .sort(),
    Afternoon: slots
      .filter((slot) => {
        const time = slot.split(" ")[1]; // Extract the time portion (e.g., "13:00")
        const hour = parseInt(time.split(":")[0]);
        return hour >= 12 && hour < 17;
      })
      .sort(),
    Evening: slots
      .filter((slot) => {
        const time = slot.split(" ")[1]; // Extract the time portion (e.g., "18:00")
        return parseInt(time.split(":")[0]) >= 17;
      })
      .sort(),
  };

  useEffect(() => {
    // Set the initial part of day based on the first available slot
    if (groupedSlots["Morning"].length > 0) {
      setPartOfDay("Morning");
      updateSelectedTime(groupedSlots["Morning"][0]);
    } else if (groupedSlots["Afternoon"].length > 0) {
      setPartOfDay("Afternoon");
      updateSelectedTime(groupedSlots["Afternoon"][0]);
    } else {
      setPartOfDay("Evening");
      updateSelectedTime(groupedSlots["Evening"][0]);
    }
  }, [slots]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="flex flex-row bg-gray-300 w-auto justify-center p-1 rounded gap-1">
          {Object.keys(groupedSlots).map((key) => (
            <h6
              key={key}
              className={`flex items-center py-1 px-7 md:px-10 rounded cursor-pointer ${
                partOfDay === key ? "bg-white" : ""
              } ${
                groupedSlots[key].length === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              onClick={() => groupedSlots[key].length > 0 && onClick(key)}
            >
              {key}
            </h6>
          ))}
        </div>
      </div>
      <ScollContainer>
        {groupedSlots[partOfDay].length === 0 ? (
          <p className="text-center text-gray-500">No slots available</p>
        ) : (
          groupedSlots[partOfDay].map((slot, index) => (
            <div key={index} className="flex flex-row">
              <div
                className={`flex justify-center items-center border py-2 px-6 rounded-lg ${
                  selectedTime === slot ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => {
                  updateSelectedTime(slot);
                }}
              >
                <p className="text-sm flex flex-shrink-0">{formatTime(slot)}</p>
              </div>
            </div>
          ))
        )}
      </ScollContainer>
    </div>
  );
};

export default TimeSection;
