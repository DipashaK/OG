import React from "react";
// import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";

// const Menu = [
//   {
//     id: 1,
//     name: "Home",
//     link: "/#",
//   },
//   {
//     id: 2,
//     name: "Top Features",
//     link: "/#Services",
//   },
//   {
//     id: 4,
//     name: "Men's Wear",
//     link: "/men",
//   },
//   {
//     id: 5,
//     name: "Electronics",
//     link: "/Electronics",
//   },
// ];

// const DropDownLinks = [
//   {
//     id: 1,
//     name: "Trending Products",
//     link: "/#"
//   },
//   {
//     id: 2,
//     name: "Best Selling",
//     link: "/#"
//   },
//   {
//     id: 3,
//     name: "Top Rated",
//     link: "/#"
//   },
// ];

const Navbar = () => {
  return (
    <>
      <div className="shadow-md bg-white dark:bg-grey-900 dark:text-white duration-200 relative z-40">
        {/* Upper Navbar */}
        <div className="bg-primary/40 py-2">
          <div className="container flex justify-between items-center">
            {/* Logo */}
            <div>
              <a href="#" className="font-bold text-2xl sm:text-3xl flex gap-3">
                {/* <img src={Logo} alt="Logo" className="w-10" /> */}
                Karogya
              </a>
            </div>

            {/* Login and Signup Buttons */}
            <div className="flex gap-4">
              <a
                href="/login"
                className="text-sm px-4 py-2 border border-primary rounded-md hover:bg-primary hover:text-black duration-200"
              >
                Login
              </a>
              <a
                href="/signUp"
                className="text-sm px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 duration-200"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>

        {/* Lower Navbar */}
        {/* <div
          className="flex justify-center"
          data-aos="zoom-out"
          data-aos-duration="6000"
        >
          <ul className="sm:flex hidden items-center gap-4">
            {Menu.map((data) => (
              <li key={data.id}>
                <a
                  href={data.link}
                  className="inline-block px-4 hover:text-primary duration-200"
                >
                  {data.name}
                </a>
              </li>
            ))}
            <li className="group relative cursor-pointer">
              <a href="#" className="flex item-center gap-[2px] py-2">
                Trending Products
                <span>
                  <FaCaretDown className="transition-all duration-200 mt-1 group-hover:rotate-180" />
                  <div className="absolute z-[9999] hidden group-hover:block w-[150px] rounded-md bg-white me-5 p-2 text-black shadow-md">
                    <ul>
                      {DropDownLinks.map((data) => (
                        <li key={data.id}>
                          <a
                            href={data.link}
                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                          >
                            {data.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </span>
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
};

export default Navbar;