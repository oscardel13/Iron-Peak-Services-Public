import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const Confirmation = () => {
  return (
    <div className="relative flex flex-col p-10 bg-white w-screen md:w-[768px] rounded-lg shadow-lg border">
      <div className="flex justify-center">
        <EventAvailableIcon className="text-6xl" />
      </div>
      <h3>Your booking is waiting on Confirmation!</h3>
    </div>
  );
};

export default Confirmation;
