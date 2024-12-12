import React from "react";

import Image1 from "../../assets/cash.png";
import Image2 from "../../assets/steth.png";
import Image3 from "../../assets/privacy.png";

import { TiStarFullOutline } from "react-icons/ti";

const ProductsData = [
  {
    id: 1,
    img: Image1,
    title: "DONATIONS",
    aosDelay: "0",
    description:
      "Worried about finances? Our donations got your back.",
  },
  {
    id: 2,
    img: Image2,
    title: "TRANSPARENCY",
    aosDelay: "200",
    description:
      "Transparency is your right. We do our best to serve your rights.",
  },
  {
    id: 3,
    img: Image3,
    title: "PRIVACY",
    aosDelay: "400",
    description:
      "Your privacy is in your hands! The data is secure with us.",
  },
];

const TopProducts = () => {
  console.log("Top Products rendered rendered");

  return (
    <div className="mt-[120px] mb-12">
      <div className="container">
        {/* Hero Section  */}
        <div className="text-center mb-[95px] max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-md text-primary">
            Why Choose Karogya?
          </p>
          <h1 data-aos="fade-up" className="text-4xl font-bold">
            Best Features
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-400">
            You are not like drop in the ocean for us. You are important. Transparency is important. Get to know us
            as well as your receiver / donor.
          </p>
        </div>
        {/* Body section  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-20 place-items-center">
          {ProductsData.map((data) => (
            <div data-aos="zoom-in" data-aos-delay={data.aosDelay} key={data.id} className="rounded-2xl mt-[100px] bg-white hover:bg-black text-black cursor-pointer relative shadow-xl duration-300 group max-w-[500px]">
              <div className="h-cover mb-3">
                {/* image section  */}
                <img
                  src={data.img}
                  alt=""
                  className="max-w-[200px] block mx-auto transform -translate-y-20 group-hover:scale-110 duration-300 drop-shadow-md"
                />
                {/* Details section  */}
                <div className="text-center">
                  {/* star rating  */}
                  <h1 className="text-xl font-bold">{data.title}</h1>
                  <h6 className="text-base mt-3 text-gray-500 line-clamp-2">
                    {data.description}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
