import React from "react";
import Image1 from "../../assets/mdoc.png";
import Image2 from "../../assets/steth.png";
import Image3 from "../../assets/fdoc.png";
import Slider from "react-slick";
import { Link } from "react-router-dom";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "What is karogya?",
    description:
      "Introducing a revolutionary system that transforms the way we approach organ donation.Here the journey to saving a life becomes personal and meaningful.With this platform, you candirectly connect with donors, ensuring a smoother and more transparent process.",
  },
  {
    id: 2,
    img: Image2,
    title: "Transparency",
    description:
      "Don’t gamble with your life through ignorance—choose KAROGYA to truly understand your donor and your receiver. Because transparency is your right.",
  },
  {
    id: 3,
    img: Image3,
    title: "Your future in your hands!",
    description:
      "Our life, your choices, your chance at a brighter future. Together, let's make every heartbeat count. ❤️",
  },
];

const Hero = () => {
  console.log("Hero rendered");

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-900 flex justify-center items center">
        {/* Background Patterns  */}
        <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-9"></div>
        {/* hero section  */}
        <div className="container pb-8 mt-10 sm:pb-0">
          {/* slider  */}
          <Slider {...settings}>
            {ImageList.map((data) => (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* text content section  */}
                  <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                    <h1
                      data-aos="zoom-out"
                      data-aos-duration="6000"
                      data-aos-oce="true"
                      className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                    >
                      {data.title}
                    </h1>
                    <p
                      className="text-sm"
                      data-aos="zoom-out"
                      data-aos-duration="6000"
                      data-aos-oce="true"
                    >
                      {data.description}
                    </p>

                    <div></div>
                  </div>

                  {/* image section  */}
                  <div className="order-1 sm:order-2">
                    <div className="relative">
                      <img
                        src={data.img}
                        data-aos="zoom-out"
                        data-aos-duration="6000"
                        data-aos-oce="true"
                        alt=""
                        className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-125 object-contain mx-auto hover:scale-105"
                        style={{ filter: "brightness(1)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Hero;
