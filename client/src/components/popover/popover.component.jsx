export default function Popover({ closeTrigger, children, top = false }) {
  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen z-50"
      onClick={closeTrigger} // Trigger close when clicking outside
    >
      <div className="absolute inset-0 bg-black/75" /> {/* dark overlay */}
      {/* Make this container relative so absolute children inside work */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative px-5 ${top ? "absolute top-0 md:top-auto" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
