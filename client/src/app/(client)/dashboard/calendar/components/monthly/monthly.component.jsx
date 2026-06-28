import { useState } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Monthly = ({ selectedDay, setSelectedDay }) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDay.getFullYear(), selectedDay.getMonth(), 1)
  );

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const startDay = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  const prevMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1,
    1
  );
  const nextMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1
  );
  const prevMonthDays = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth() + 1,
    0
  ).getDate();

  const days = [];

  // Fill in previous month's days
  for (let i = startDay - 1; i >= 0; i--) {
    const day = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth(),
      prevMonthDays - i
    );
    days.push({ day, isCurrentMonth: false });
  }

  // Fill in current month's days
  for (let i = 1; i <= totalDays; i++) {
    const day = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i
    );
    days.push({ day, isCurrentMonth: true });
  }

  // Fill in next month's days to complete the last week
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const day = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
      days.push({ day, isCurrentMonth: false });
    }
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const today = new Date();

  return (
    <div>
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="flex justify-center items-center hover:bg-black hover:text-white border border-black rounded-full w-8 h-8 font-bold"
          onClick={() => setCurrentMonth(prevMonth)}
        >
          &lt;
        </button>
        <h2 className="font-semibold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          className="flex justify-center items-center hover:bg-black hover:text-white border border-black rounded-full w-8 h-8 font-bold"
          onClick={() => setCurrentMonth(nextMonth)}
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

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map(({ day, isCurrentMonth }, idx) => {
          const isSelected = isSameDay(day, selectedDay);
          const isToday = isSameDay(day, today);

          let classNames = "py-2 rounded-full";

          if (isSelected) {
            classNames += " bg-black text-white font-medium";
          } else if (isToday) {
            classNames += " text-red-700 font-medium";
          } else if (!isCurrentMonth) {
            classNames += " text-gray-400 font-medium";
          } else {
            classNames += " text-black font-medium";
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

export default Monthly;
