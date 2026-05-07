import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EventGallery from "@/components/EventGallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <EventGallery />
      </main>
      <Footer />
    </>
  );
}
