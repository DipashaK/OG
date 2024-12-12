import Hero from "../newComponents/Hero/Hero";
import Navbar from "../newComponents/Navbar/Navbar";
import TopProducts from "../newComponents/Products/TopProducts";
import Banner from "../newComponents/Banner/Banner";
import AOS from "aos";
// import "aos/dist/aos.css"
import { useEffect } from "react";
import Suscribe from "../newComponents/Banner/Suscribe";
import Testimonials from "../newComponents/Testimonials/Testimonials";
import Footer from "../newComponents/Footer/Footer";

function LandingPage() {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration:800,
      easing: "ease-in-out",
      delay: 100
    });
    AOS.refresh();
  },[])

  return (
    <>
      <Navbar/>
      <Hero/>
      <TopProducts/>
       {/* <Banner/>
      <Suscribe/> */}
      <Testimonials/>
      <Footer/>
    </>
  )

}

export default LandingPage;