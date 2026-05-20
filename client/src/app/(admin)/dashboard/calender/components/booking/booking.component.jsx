import { useEffect, useState } from "react";
import { selectCurrentUser } from "../../../../../../../store/user/user.selector";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import Popover from "../../../../../../../components/popover/popover.component";
import DaysSection from "./components/days-section/days-section.component";
import SummarySection from "./components/summary-section/summary-section.component";
import TimeSection from "./components/times-section/times-section.component";
import TotalSection from "./components/total-section/total-section.component";
import { useSelector } from "react-redux";
import { postAPI } from "../../../../../../../utils/api";
import { getFirstBookingDay, updateAvailability } from "./booking.helpers";

// if no availability on a date add way to notify me if something opens up

const Booking = ({ service, barber, closeBooking }) => {
  let user = useSelector(selectCurrentUser);

  const availability = updateAvailability(
    barber.availability,
    service.duration
  );

  const firstBookingDay = getFirstBookingDay(availability);
  const [selectedDate, setSelectedDate] = useState(firstBookingDay);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const newSlots = availability.find(({ date }) => {
      return date === selectedDate;
    });
    // const now = new Date();

    // const filteredSlots = newSlots.slots.filter((slot) => {
    //   const [datePart, timePart] = slot.split(" ");
    //   const slotDateTime = new Date(`${datePart}T${timePart}`);
    //   return slotDateTime >= now;
    // });

    setSlots(newSlots.slots);
  }, [selectedDate]);

  const updateSelectedDate = (date) => {
    setSelectedDate(date);
  };

  const updateSelectedTime = (time) => {
    setSelectedTime(time);
  };

  const getNextAvailableDate = () => {
    let nextDate;
    let selectedDateFound = false;
    for (let index in availability) {
      if (selectedDateFound && availability[index].slots.length > 0) {
        nextDate = availability[index].date;
        break;
      }
      if (availability[index].date === selectedDate) {
        selectedDateFound = true;
      }
    }
    if (!nextDate) {
      nextDate = availability[availability.length - 1].date;
    }
    setSelectedDate(nextDate);
  };

  // have this redirect to booking confirmed. it could say on the popover
  const confirmBooking = async () => {
    const booking = {
      barber,
      user,
      service,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const res = await postAPI("/bookings", booking);

      // If the booking was successful
      if (res.status === 200) {
        // Navigate to the booking confirmation page
        window.location.replace("/booking-confirmed");
      }
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <Popover closeTrigger={closeBooking}>
      <div className="relative flex flex-col px-3 py-5 bg-white w-screen md:w-[768px] rounded-lg shadow-lg border">
        <DaysSection
          selectedDate={selectedDate}
          updateSelectedDate={updateSelectedDate}
          availability={availability}
          slots={slots}
        />
        {slots.length > 0 && (
          <TimeSection
            slots={slots}
            selectedTime={selectedTime}
            updateSelectedTime={updateSelectedTime}
            serviceDuration={service.duration}
          />
        )}
        {slots.length === 0 && (
          <div className="flex flex-col justify-center items-center py-5 gap-5">
            <EventBusyIcon className="text-gray-500 text-6xl" />
            <h6 className="text-lg font-semibold">
              There is no availability left on this date
            </h6>
            <button
              className="py-2 px-5 flex justify-center items-center bg-blue-500 border rounded-lg text-white hover:bg-blue-300 cursor-pointer"
              onClick={getNextAvailableDate}
            >
              Find Next Available Date
            </button>
          </div>
        )}
        {slots.length > 0 && (
          <SummarySection
            barber={barber}
            service={service}
            startTime={selectedTime}
          />
        )}
        {slots.length > 0 && (
          <>
            <hr className="my-5" />
            <TotalSection
              confirmBooking={confirmBooking}
              total={service.price}
              duration={service.duration}
            />
          </>
        )}
        <button
          onClick={closeBooking}
          className="absolute flex justify-center items-center top-5 right-5 text-black text-4xl hover:animate-spin90 hover:text-gray-500 w-4 h-4"
        >
          &times;
        </button>
      </div>
    </Popover>
  );
};

export default Booking;
