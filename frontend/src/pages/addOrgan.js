import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/common/Header";

const OrganDonorManager = () => {
  const [donors, setDonors] = useState([]);
  const [newDonor, setNewDonor] = useState({
    organ: "",
    donorName: "",
    phone: "",
    email: "",
    gender: "",
    bloodGroup: "",
    id: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setLocalEmail(storedEmail);
    } else {
      toast.error("No email found in local storage.");
      navigate("/login");
    }

    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/donor", {
        headers: { Authorization: `Bearer ${token} `},
      });

      setDonors(response.data);
      console.log("Donors fetched successfully:", response.data);
    } catch (error) {
      toast.error("Error fetching donors.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // const addOrUpdateDonor = async () => {
  //   const { donorName, phone, email, gender, organ, bloodGroup } = newDonor;

  //   if (!validateEmail(email)) {
  //     setEmailError("Please enter a valid email address.");
  //     return;
  //   } else {
  //     setEmailError("");
  //   }

  //   if (email !== localEmail) {
  //     toast.error("You are only allowed to add donors with your email.");
  //     return;
  //   }

  //   if (!donorName || !phone || !gender || !organ || !bloodGroup) {
  //     toast.error("Please fill out all fields.");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("auth_token");
  //     if (newDonor.id) {
  //       await axios.put(`http://localhost:5000/api/donor/${newDonor.id}`, newDonor, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       toast.success("Donor updated successfully!");
  //     } else {
  //       await axios.post("http://localhost:5000/api/donor", newDonor, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       toast.success("Donor added successfully!");
  //     }
  //     fetchDonors();
  //     resetForm();
  //   } catch (error) {
  //     toast.error("Error saving donor.");
  //     console.error(error);
  //   }

  //   setIsModalOpen(false);
  // };


  const addOrUpdateDonor = async () => {
    const { donorName, phone, email, gender, organ, bloodGroup } = newDonor;
  
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }
  
    if (email !== localEmail) {
      toast.error("You are only allowed to add donors with your email.");
      return;
    }
  
    if (!donorName || !phone || !gender || !organ || !bloodGroup) {
      toast.error("Please fill out all fields.");
      return;
    }
  
    try {
      const token = localStorage.getItem("auth_token");
      
      if (newDonor.id) { // Update existing donor
        await axios.put(`http://localhost:5000/api/donor/put${newDonor.id}`, newDonor, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Donor updated successfully!");
      } else { // Add new donor
        await axios.post("http://localhost:5000/api/donor", newDonor, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Donor added successfully!");
      }
  
      fetchDonors();
      resetForm();
    } catch (error) {
      toast.error("Error saving donor.");
      console.error(error);
    }
  
    setIsModalOpen(false);
  };
  
  const resetForm = () => {
    setNewDonor({
      organ: "",
      donorName: "",
      phone: "",
      email: "",
      gender: "",
      bloodGroup: "",
      id: null,
    });
    setIsModalOpen(false);
    setEmailError("");
  };

  const handleDeleteDonor = async (donorId) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        const token = localStorage.getItem("auth_token");
        await axios.delete(`http://localhost:5000/api/donor/${donorId}`, {
          headers: { Authorization: `Bearer ${token} `},
        });
        toast.success("Donor deleted successfully!");
        fetchDonors();
      } catch (error) {
        toast.error("Error deleting donor.");
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="bg-gray-900 min-h-screen p-5">
      <Header title="Organ Donation" />

      <div className="container mx-auto bg-gray-800 rounded-lg shadow-lg p-6 mt-16">
        <div className="flex justify-between mb-4">
          <button
            type="button"
            className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm transition-transform transform hover:scale-105 hover:bg-blue-700"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Add Donor
          </button>
        </div>

        <div className="overflow-x-auto mb-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="loader"></div>
            </div>
          ) : (
            <table className="table-auto w-full text-left bg-gray-800 text-gray-300">
              <thead>
                <tr>
                  <th className="border-b border-gray-600 px-2 py-2">#</th>
                  <th className="border-b border-gray-600 px-2 py-2">Donor Name</th>
                  <th className="border-b border-gray-600 px-2 py-2">Phone</th>
                  <th className="border-b border-gray-600 px-2 py-2">Email</th>
                  <th className="border-b border-gray-600 px-2 py-2">Organ</th>
                  <th className="border-b border-gray-600 px-2 py-2">Blood Group</th>
                  <th className="border-b border-gray-600 px-2 py-2">Gender</th>
                  <th className="border-b border-gray-600 px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, index) => (
                  <tr
                    key={donor._id}
                    className="hover:bg-gray-700 transition-colors duration-300"
                  >
                    <td className="border-b border-gray-600 px-2 py-2">{index + 1}</td>
                    <td className="border-b border-gray-600 px-2 py-2">{donor.donorName}</td>
                    <td className="border-b border-gray-600 px-2 py-2">{donor.phone}</td>
                    <td className="border-b border-gray-600 px-2 py-2">{donor.email}</td>
                    <td className="border-b border-gray-600 px-2 py-2">{donor.organ}</td>
                    <td className="border-b border-gray-600 px-2 py-2">{donor.bloodGroup}</td>
                    <td className="border-b border-gray-600 px-2 py-2">{donor.gender}</td>
                    <td className="border-b border-gray-600 px-2 py-2 text-center">

                      <button
  onClick={() => {
    // Open the modal and set the donor data for editing
    setNewDonor(donor);
    setIsModalOpen(true);
  }}
  className="text-blue-500 hover:text-blue-400 mx-2 transition-transform transform hover:scale-105"
>
  Edit
</button>

<button
  onClick={() => {
    // Call the delete function and pass the donor's ID to delete it from the backend
    handleDeleteDonor(donor._id);
  }}
  className="text-red-500 hover:text-red-400 mx-2 transition-transform transform hover:scale-105"
>
  Delete
</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Donor */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-white text-2xl font-semibold mb-4">
              {newDonor.id ? "Edit Donor" : "Add Donor"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300">Donor Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded text-black"
                  value={newDonor.donorName}
                  onChange={(e) => setNewDonor({ ...newDonor, donorName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-300">Phone</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded text-black"
                  value={newDonor.phone}
                  onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-300">Email</label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border rounded text-black ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                  value={newDonor.email}
                  onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>
              <div>
                <label className="block text-gray-300">Organ</label>
                <select
                  className="w-full px-3 py-2 border rounded text-black"
                  value={newDonor.organ}
                  onChange={(e) => setNewDonor({ ...newDonor, organ: e.target.value })}
                >
                  <option value="">Select Organ</option>
                  <option value="Kidney">Kidney</option>
                  <option value="Liver">Liver</option>
                  <option value="Heart">Heart</option>
                  <option value="Lung">Lung</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300">Blood Group</label>
                <select
                  className="w-full px-3 py-2 border rounded text-black"
                  value={newDonor.bloodGroup}
                  onChange={(e) => setNewDonor({ ...newDonor, bloodGroup: e.target.value })}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300">Gender</label>
                <select
                  className="w-full px-3 py-2 border rounded text-black"
                  value={newDonor.gender}
                  onChange={(e) => setNewDonor({ ...newDonor, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addOrUpdateDonor}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrganDonorManager;