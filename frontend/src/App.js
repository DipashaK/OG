// import { Route, Routes, useLocation, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Sidebar from "./components/common/Sidebar";
// import OverviewPage from "./pages/OverviewPage";
// import SettingsPage from "./pages/SettingsPage";
// import DonorsPage from "./pages/DonorsPage";
// import RecipientsPage from "./pages/RecipientsPage";
// import CalendarPage from "./pages/CalendarPage";
// import TrackOrganPage from "./pages/TrackOrganPage";
// import OrganManager from "./pages/addOrgan";
// import OrganRecieverManager from "./pages/addReciver";
// import Login from "./pages/LoginPage";
// import SignUp from "./pages/SignupPage";
// import DonorReceiverPage from "./pages/donorRecieverPage";
// import './index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import MatchingPage from "./pages/matchingPage";
// import LandingPage from "./pages/LandingPage";

// function App() {
//   const location = useLocation();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const userEmail = localStorage.getItem("userEmail");
//     setIsAuthenticated(!!userEmail);
//   }, []);

//   const hideSidebarPaths = [
//     "/login",
//     "/signUp",
//     "/",
//     "/donor-receiver",
//     "/add-organ",
//     "/add-receiver"
//   ];

//   const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

//   return (
//     <div className="flex h-screen bg-gray-900 text-white  overflow-auto">
//     {/* <Routes>
//       <Route path="/" element={<LandingPage />}/>
//     </Routes>
//        */}

//       <div className={`flex-1 overflow-auto  ${shouldShowSidebar ? "" : "w-full"}`}>
//       {shouldShowSidebar && <Sidebar />} 
//         <Routes>
//           <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
//           <Route path="/signUp" element={<SignUp />} />
//           <Route
//             path="/donor-receiver"
//             element={isAuthenticated ? <DonorReceiverPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/overview"
//             element={isAuthenticated ? <OverviewPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/donors"
//             element={isAuthenticated ? <DonorsPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/recipients"
//             element={isAuthenticated ? <RecipientsPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/matching"
//             element={isAuthenticated ? <MatchingPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/track-organ"
//             element={isAuthenticated ? <TrackOrganPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/calendar"
//             element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/settings"
//             element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/add-organ"
//             element={isAuthenticated ? <OrganManager /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/add-receiver"
//             element={isAuthenticated ? <OrganRecieverManager /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="*"
//             element={
//               <div className="flex items-center justify-center h-full text-center">
//                 <h1 className="text-2xl font-bold text-red-500">404 - Page Not Found</h1>
//               </div>
//             }
//           />
//         </Routes>
//       </div>
//      </div>
//   );
// }

// export default App;























import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";
import DonorsPage from "./pages/DonorsPage";
import RecipientsPage from "./pages/RecipientsPage";
import CalendarPage from "./pages/CalendarPage";
import TrackOrganPage from "./pages/TrackOrganPage";
import OrganManager from "./pages/addOrgan";
import OrganRecieverManager from "./pages/addReciver";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import DonorReceiverPage from "./pages/donorRecieverPage";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MatchingPage from "./pages/matchingPage";
import LandingPage from "./pages/LandingPage";

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setIsAuthenticated(!!userEmail);
  }, []);

  const hideSidebarPaths = [
    "/login",
    "/signUp",
    "/",
    "/donor-receiver",
    "/add-organ",
    "/add-receiver"
  ];

  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Main content area */}
      <div className={`flex flex-1 ${shouldShowSidebar ? "pl-[2px]" : ""} overflow-auto`}>
        {/* Sidebar */}
        {shouldShowSidebar && <Sidebar />}
        
        {/* Routes */}
        <div className="flex-1 overflow-auto">
          <Routes>
          <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route
              path="/donor-receiver"
              element={isAuthenticated ? <DonorReceiverPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/overview"
              element={isAuthenticated ? <OverviewPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/donors"
              element={isAuthenticated ? <DonorsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/recipients"
              element={isAuthenticated ? <RecipientsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/matching"
              element={isAuthenticated ? <MatchingPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/track-organ"
              element={isAuthenticated ? <TrackOrganPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/calendar"
              element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/add-organ"
              element={isAuthenticated ? <OrganManager /> : <Navigate to="/login" />}
            />
            <Route
              path="/add-receiver"
              element={isAuthenticated ? <OrganRecieverManager /> : <Navigate to="/login" />}
            />
            {/* <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-full text-center">
                  <h1 className="text-2xl font-bold text-red-500">404 - Page Not Found</h1>
                </div>
              }
            /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
