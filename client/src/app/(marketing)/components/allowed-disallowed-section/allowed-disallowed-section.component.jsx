import {
  ALLOWED_ITEMS,
  NOT_ALLOWED_ITEMS,
} from "@/data/faq";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

function ItemsList({ items, color = "green" }) {
  const divider =
    color === "green" ? "border-green-500/40" : "border-red-500/40";

  return (
    <div className="space-y-6">
      {items.map((item, idx) => (
        <div key={idx}>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-gray-700 mt-2">{item.description}</p>

          {idx !== items.length - 1 && (
            <div className={`mt-6 border-b ${divider}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AllowedDisallowedSection() {
  return (
    <section className="px-4 md:px-10 lg:px-16 py-16 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Allowed */}
        <div className="rounded-2xl border-2 border-green-600 bg-green-100/70 p-8">

          <div className="flex items-center gap-4 mb-8">
            <ThumbUpIcon
              sx={{ fontSize: 48 }}
              className="text-green-700"
            />

            <h2 className="text-2xl font-bold text-graphite">
              Allowed
            </h2>
          </div>

          <ItemsList items={ALLOWED_ITEMS} color="green" />

        </div>

        {/* Not Allowed */}
        <div className="rounded-2xl border-2 border-red-500 bg-red-100/70 p-8">

          <div className="flex items-center gap-4 mb-8">
            <ThumbDownIcon
              sx={{ fontSize: 48 }}
              className="text-red-600"
            />

            <h2 className="text-2xl font-bold text-graphite">
              Not Allowed
            </h2>
          </div>

          <ItemsList items={NOT_ALLOWED_ITEMS} color="red" />

        </div>

      </div>
    </section>
  );
}