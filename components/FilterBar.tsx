"use client";

const CATEGORIES = [
  "All",
  "Technology",
  "Design",
  "Business",
  "Community",
  "Career",
  "Entertainment",
];

export default function FilterBar({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === cat
              ? "bg-blue-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
