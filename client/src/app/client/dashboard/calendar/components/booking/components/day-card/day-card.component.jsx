const DayCard = ({ date, openSlots, selectedDate, updateSelectedDate }) => {
  const selected = date === selectedDate;
  const isToday = date.day === new Date().getDate().toString();
  return (
    <div
      className={`flex flex-col flex-shrink-0 justify-center h-24 w-16 px-1 py-2 border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 invisible-scrollbar ${
        selected ? "bg-blue-500" : openSlots === 0 ? "text-gray-500" : ""
      }`}
      onClick={() => updateSelectedDate(date)}
    >
      <span
        className={`${
          selected
            ? "text-white"
            : isToday
            ? "text-blue-500"
            : openSlots === 0
            ? "text-gray-500"
            : ""
        }`}
      >
        {date.dayOfWeek.slice(0, 3)}
      </span>
      <span
        className={`${
          selected
            ? "text-white font-bold"
            : isToday
            ? "text-blue-500 font-semibold"
            : "font-semibold"
        }`}
      >
        {date.day}
      </span>
      {openSlots === 0 ? null : openSlots < 4 ? (
        <div className="flex px-5 pt-2">
          <div className="h-[6px] w-full bg-red-600 rounded-lg border border-white"></div>
        </div>
      ) : openSlots <= 10 ? (
        <div className="flex px-4 pt-2">
          <div className="h-[6px] w-full bg-yellow-600 rounded-lg border border-white"></div>
        </div>
      ) : (
        <div className="flex px-3 pt-2">
          <div className="h-[6px] w-full bg-green-600 rounded-lg border border-white"></div>
        </div>
      )}
    </div>
  );
};

export default DayCard;
