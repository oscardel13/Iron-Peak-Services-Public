import METADATA from "@/data/data.jsx";

export default function ValueSection() {
  return (
    <section className="shadow-md rounded-lg p-7 py-20 md:px-16 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-5">
        {METADATA.values.map(({ title, description, Icon }) => (
          <div
            key={title}
            className="flex flex-col items-center space-y-4 text-center"
          >
            <div className="flex justify-center items-center w-32 h-32 border-4 border-gray-700 bg-brand-primary rounded-full p-2">
              <Icon className="scale-275 mx-auto" />
            </div>
            <div className="text-3xl font-bold text-brand-text-primary">
              {title}
            </div>
            <p className="text-gray-800 max-w-96">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
