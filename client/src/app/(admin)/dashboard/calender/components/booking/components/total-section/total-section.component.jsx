import { durationToMinutes } from "../../../../utils/helper-functions";

const TotalSection = ({ total, duration, confirmBooking }) => {
  return (
    <div className="flex flex-col md:px-7">
      <div className="flex flex-col py-3">
        <div className="flex flex-row justify-end gap-3 items-center text-end">
          <span className="text-sm">Total:</span>
          <span className="text-2xl font-semibold">${total}.00</span>
        </div>
        <span className="text-gray-500 text-end">
          {durationToMinutes(duration)}
        </span>
      </div>
      <button
        className="flex w-full py-3 justify-center items-center bg-blue-600 hover:bg-blue-600 text-white rounded-lg shadow"
        onClick={confirmBooking}
      >
        Book
      </button>
    </div>
  );
};

export default TotalSection;
