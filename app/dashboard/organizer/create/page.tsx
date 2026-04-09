import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateEventForm from "@/components/CreateEventForm";

export default function CreateEventPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <Navbar />

      <div className="mx-auto mt-8 max-w-3xl">
        <CreateEventForm />
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </main>
  );
}