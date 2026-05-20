import { formatTime } from "../../../../utils/helper-functions";

// First get this to work for one then read the one below
// Update this to get it from this from the store so they can add multiple services and book them all at the same time. also add X in the right to be able to remove them

const SummarySection = ({ service, startTime, barber }) => {
  // function that take startTime and servce.duration and return string startTime - endTime (02:00 PM - 02:45 AM) startTime : "15:00" called get Time Slot ("02:00 PM - 02:45 AM") should return "02:00 PM - 02:45 AM"
  const getTimeSlot = (startTime, duration) => {
    const startTimeHour = startTime.slice(-5).split(":")[0];
    const startTimeMinute = startTime.slice(-5).split(":")[1];
    const endTimeHour = parseInt(startTimeHour) + Math.floor(duration / 60);
    const endTimeMinute = parseInt(startTimeMinute) + (duration % 60);
    const endTime = `${endTimeHour}:${endTimeMinute}`;
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  return (
    <div className="md:px-8">
      <div className="flex flex-col w-full py-3 bg-gray-200 rounded-lg">
        <div className="flex flex-row justify-between px-6 pt-2 pb-5">
          <div className="flex flex-col text-left">
            <h6 className="text-lg font-semibold">{service.name}</h6>
            <span className="text-sm text-gray-600">{service.description}</span>
          </div>
          <div className="flex flex-col font-semibold text-right w-72">
            <h6 className="text-lg">${service.price}.00</h6>
            {startTime && (
              <span className="text-sm text-gray-600">
                {getTimeSlot(startTime, service.duration)}
              </span>
            )}
          </div>
        </div>
        <hr />
        <div className="flex flex-row pt-3 px-6">
          <div className="flex flex-row items-center">
            <span className="text-gray-600">Staff: </span>
          </div>

          <div className="ml-2 flex flex-row items-center gap-2">
            <img className="h-8 rounded-full" src={barber.picture} alt="" />
            <span className="text-gray-800">{barber.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
