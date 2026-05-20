import { useEffect, useState } from "react";
import { getAPI } from "../../../../../utils/api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentBarber } from "../../../../../store/barber/barber.selector";

const STATUS_TO_COLOR = {
  confirmed: "border-green-600",
  canceled: "border-red-600",
  pending: "border-yellow-600",
};

const Day = ({ selectedDay, setSelectedDay }) => {
  const barber = useSelector(selectCurrentBarber);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const start = new Date(selectedDay);
        const end = new Date(selectedDay);
        end.setDate(end.getDate() + 1);
        const params = {
          barberId: barber._id,
          start,
          end,
        };
        const res = await getAPI("/bookings", params);
        console.log();
        setBookings(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getBookings();
  }, [selectedDay]);

  const goToPreviousDay = () => {
    const prev = new Date(selectedDay);
    prev.setDate(prev.getDate() - 1);
    setSelectedDay(prev);
  };
  const goToNextDay = () => {
    const next = new Date(selectedDay);
    next.setDate(next.getDate() + 1);
    setSelectedDay(next);
  };

  // 1px per minute makes math trivial
  const pxPerMinute = 2.25;
  const dayStartMinutes = 8 * 60; // 8:00 AM

  // calculate top offset and height in px
  const getBookingStyles = ({ startTime, endTime }) => {
    const sh = Number(
      new Date(startTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        hourCycle: "h23",
      }),
    );
    const sm = Number(
      new Date(startTime).toLocaleTimeString("en-US", { minute: "numeric" }),
    );
    const eh = Number(
      new Date(endTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        hourCycle: "h23",
      }),
    );
    const em = Number(
      new Date(endTime).toLocaleTimeString("en-US", { minute: "numeric" }),
    );

    const startTotal = sh * 60 + sm;
    const endTotal = eh * 60 + em;
    const top = (startTotal - dayStartMinutes) * pxPerMinute;
    const height = (endTotal - startTotal) * pxPerMinute;
    return { top, height };
  };

  const formatFullTime = (h) =>
    new Date(h).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

  return (
    <div className="py-4 lg:px-60">
      {/* Date Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousDay}
          className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white font-bold"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold">
          {selectedDay.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h2>
        <button
          onClick={goToNextDay}
          className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white font-bold"
        >
          &gt;
        </button>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-gray-300">
        {/* time markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const hour = 8 + i;
          return (
            <div
              key={hour}
              className="relative"
              style={{ height: 60 * pxPerMinute }}
            >
              {/* solid line at top of each hour */}
              <div className="absolute top-0 left-0 right-0 flex items-center">
                <div className="w-[70px] text-right pr-2 text-sm font-medium">
                  {new Date(0, 0, 0, hour, 0).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex-1 border-t border-gray-700" />
              </div>
              {/* dashed lines at 15/30/45 */}
              {[15, 30, 45].map((m) => (
                <div
                  key={m}
                  className="absolute left-0 right-0 flex items-center"
                  style={{ top: m * pxPerMinute }}
                >
                  <div className="w-[70px] text-right pr-2 text-xs text-gray-500">{`${String(
                    m,
                  ).padStart(2, "0")}`}</div>
                  <div className="flex-1 border-t border-dashed border-gray-500" />
                </div>
              ))}
            </div>
          );
        })}

        {/* bookings */}
        {bookings.map((b, idx) => {
          const { top, height } = getBookingStyles(b);
          return (
            <Link
              to={`/barber-dashboard/bookings/${b._id}`}
              key={idx}
              className={`absolute cursor-pointer bg-black border-l-8 ${STATUS_TO_COLOR[b.status] ?? "border-gray-600"} rounded p-2 shadow-sm z-10`}
              style={{
                top: top + 13.5, // nudge just below the line
                height: height - 9, // end before next line
                left: 71, // match paddingLeft
                right: 1,
              }}
            >
              <div className="flex flex-row items-center gap-2 font-semibold text-white">
                <div>{b.name}</div>
                <span>&#8226;</span>
                <div>{b.service.name}</div>
              </div>
              <div className="text-white">{`${formatFullTime(b.startTime)} - ${formatFullTime(b.endTime)}`}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Day;
