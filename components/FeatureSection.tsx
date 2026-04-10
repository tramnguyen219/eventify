import Link from "next/link";

type FeatureSectionProps = {
  showCta?: boolean;
};

const features = [
  {
    title: "Easy Booking",
    description: "Users can browse events and register in a simple and organized way.",
  },
  {
    title: "Organizer Tools",
    description: "Organizers can create, update, and manage events using one dashboard.",
  },
  {
    title: "Responsive Design",
    description: "The platform is designed to work well on both desktop and mobile devices.",
  },
];

export default function FeatureSection({ showCta = false }: FeatureSectionProps) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Why choose Eventify?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything needed for organizing and attending events in one platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
            >
              <h3 className="mb-3 text-xl font-semibold text-slate-900">{f.title}</h3>
              <p className="text-slate-600">{f.description}</p>
            </article>
          ))}
        </div>

        {showCta && (
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold">Ready to create your first event?</h3>
              <p className="mt-2 text-blue-100">
                Start organizing events and managing attendees right away.
              </p>
              <Link
                href="/dashboard/organizer"
                className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-blue-600 transition-all hover:bg-slate-100"
              >
                Create Event
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
