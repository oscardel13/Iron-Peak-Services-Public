import { useState } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Weekly = ({ selectedDay, setSelectedDay }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const day = new Date(selectedDay);
    const diff = day.getDate() - day.getDay(); // Sunday start
    return new Date(day.setDate(diff));
  });

  const getWeekDays = (startDate) => {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const today = new Date();
  const weekDays = getWeekDays(currentWeekStart);

  const changeWeek = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newStart);
  };

  return (
    <div>
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="flex justify-center items-center hover:bg-black hover:text-white border border-black rounded-full w-8 h-8 font-bold"
          onClick={() => changeWeek(-1)}
        >
          &lt;
        </button>
        <h2 className="font-semibold">
          {currentWeekStart.toLocaleDateString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          -{" "}
          {new Date(
            currentWeekStart.getTime() + 6 * 86400000
          ).toLocaleDateString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h2>
        <button
          className="flex justify-center items-center hover:bg-black hover:text-white border border-black rounded-full w-8 h-8 font-bold"
          onClick={() => changeWeek(1)}
        >
          &gt;
        </button>
      </div>

      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 text-center font-bold mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDay);
          const isToday = isSameDay(day, today);

          let classNames = "py-2 rounded";

          if (isSelected) {
            classNames += " bg-black text-white";
          } else if (isToday) {
            classNames += " text-red-500";
          } else {
            classNames += " text-black";
          }

          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(day)}
              className={classNames}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Weekly;
