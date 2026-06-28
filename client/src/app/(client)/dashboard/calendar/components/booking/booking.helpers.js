import moment from "moment";

export function updateAvailability(availability, duration) {
  // Deep clone the availability array to avoid mutating the original
  const clonedAvailability = availability?.map((day) => ({
    ...day,
    slots: [...day.slots], // Clone the slots array
  }));

  const updatedAvailability = clonedAvailability?.map((day) => {
    day.slots = filterSlots(day.slots, duration);
    return day;
  });

  // filter slots that have passed for today
  const now = moment();
  if (updatedAvailability?.length > 0) {
    updatedAvailability[0].slots = updatedAvailability[0].slots.filter(
      (slot) => {
        const slotMoment = moment(slot, "YYYY-MM-DD HH:mm");
        return slotMoment.isSameOrAfter(now);
      }
    );
  }

  return updatedAvailability;
}

function filterSlots(slots, duration) {
  const slotInterval = 15; // Assuming slots are 15 minutes apart
  const slotsNeeded = Math.ceil(duration / slotInterval);

  // Convert all slots to moment objects
  const slotTimes = slots.map((slot) => moment(slot, "YYYY-MM-DD HH:mm"));

  // Filter slots based on availability for the full duration
  const updatedSlots = slots.filter((_, i) => {
    // Check if the required slots fit into the available times
    if (i + slotsNeeded > slots.length) return false; // Not enough slots left

    for (let j = 0; j < slotsNeeded; j++) {
      const expectedTime = slotTimes[i]
        .clone()
        .add(j * slotInterval, "minutes");
      if (!slotTimes[i + j] || !slotTimes[i + j].isSame(expectedTime)) {
        return false; // Slot sequence is broken
      }
    }
    return true; // Slots can accommodate the duration
  });

  return updatedSlots;
}

// function that gets the first bookingDay with open slots
export const getFirstBookingDay = (availability) => {
  const firstBookingDay = availability?.find(({ slots }) => {
    return slots.length > 0;
  });
  return firstBookingDay.date;
};
