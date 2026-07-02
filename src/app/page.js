import SectionNav from "@/components/Common/SectionNav/SectionNav";
import Hero from "@/components/Hero/Hero";
import Story from "@/components/Story/Story";
import Offerings from "@/components/Offerings/Offerings";
import Gallery from "@/components/Gallery/Gallery";
import Craft from "@/components/Craft/Craft";
import Testimonials from "@/components/Testimonials/Testimonials";
import FAQ from "@/components/FAQ/FAQ";
import Visit from "@/components/Visit/Visit";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Cakes Treats — French-country patisserie",
  description:
    "Cakes Treats — madeleines, layer cakes, preserves, and afternoon treats. Hours, gallery, and pickup notes. cakestreats.com",
  keywords: [
    "patisserie",
    "cakes",
    "madeleines",
    "preserves",
    "afternoon tea",
    "French country bakery",
    "visit",
    "hours",
    "pickup",
  ],
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <SectionNav />
      <Hero />
      <Story />
      <Offerings />
      <Gallery />
      <Craft />
      <Testimonials />
      <FAQ />
      <Visit />
    </>
  );
}
