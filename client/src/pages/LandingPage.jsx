import { HeroSection, Footer } from "../components/websection/PageContainer";
import { Navbar } from "../components/websection/Navbar";
import ArticleSection from "@/components/websection/ArticleSection";

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </>
  );
}

export default LandingPage;
