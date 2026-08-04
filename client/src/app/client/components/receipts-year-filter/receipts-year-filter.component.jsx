"use client";

export default function ReceiptsYearFilter({
  years = [],
  selectedYear,
  setSelectedYear,
}) {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="receipt-year"
        className="text-sm font-semibold text-gray-700"
      >
        Year
      </label>

      <select
        id="receipt-year"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none transition focus:border-brand-primary"
      >
        <option value="all">All years</option>

        {years.map((year) => (
          <option key={year} value={String(year)}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
