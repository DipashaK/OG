import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const [isLogoutVisible, setLogoutVisible] = useState(false);
  const navigate = useNavigate();

  // Get the email from localStorage
  const email = localStorage.getItem("userEmail");

  const toggleLogout = () => {
    setLogoutVisible((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/"); 
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <div className="relative">
          <button
            onClick={toggleLogout}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition duration-200"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt1MCkcc9N01BCt6q1G12dXL2np82d63podA&s"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          {isLogoutVisible && (
            <div
              className="absolute right-0 mt-2 z-50 bg-white rounded-lg shadow-lg p-2"
              style={{ minWidth: "150px" }}
            >
              {/* Display the email if it exists */}
              {email && (
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  Logged in as: 
                  <div className="font-medium text-black">{email}</div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-semibold text-red-600 px-4 py-2 hover:bg-red-100 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
