import {HeroSection, Footer} from '../components/PageContainer'
import { Navbar } from '../components/ui/Navbar';
import ArticleSection from '../components/ArticleSection';

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
