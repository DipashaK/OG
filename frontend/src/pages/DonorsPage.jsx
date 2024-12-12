import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CheckCircle, Clock, UserPlus, Edit, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [updatedDonorData, setUpdatedDonorData] = useState({
    donorName: "",
    phone: "",
    email: "",
    organ: "",
    bloodGroup: "",
    gender: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No token found.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDonors(response.data);
      } catch (error) {
        console.error(
          "Error fetching donors:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchDonors();
  }, []);

  const filteredDonors = donors.filter((donor) =>
    Object.values(donor)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalDonors = donors.length;
  const pendingDonations = donors.filter((donor) => donor.status === "Pending").length;
  const completedDonations = donors.filter((donor) => donor.status !== "Pending").length;

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Donor Report", 14, 20);

    const tableColumn = [
      "Donor Name",
      "Phone",
      "Email",
      "Organ",
      "Blood Group",
      "Gender",
      "Status",
    ];
    const tableRows = donors.map((donor) => [
      donor.donorName,
      donor.phone,
      donor.email,
      donor.organ,
      donor.bloodGroup,
      donor.gender,
      donor.status || "Pending",
    ]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    doc.save("donors_report.pdf");
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No token found.");
        toast.error("Authorization token missing. Please log in again.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/admin/api/donor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonors((prevDonors) => prevDonors.filter((donor) => donor._id !== id));
      toast.success("Donor deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting donor:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to delete donor.");
    }
  };

  const handleEdit = (donor) => {
    setSelectedDonor(donor);
    setUpdatedDonorData({
      donorName: donor.donorName,
      phone: donor.phone,
      email: donor.email,
      organ: donor.organ,
      bloodGroup: donor.bloodGroup,
      gender: donor.gender,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No token found.");
        toast.error("Authorization token missing. Please log in again.");
        return;
      }

      const namePattern = /^[A-Za-z]{1,20}$/;
      const phonePattern = /^\d{10}$/;
      const emailPattern = /^[a-zA-Z0-9]+@gmail\.com$/;

      if (!namePattern.test(updatedDonorData.donorName)) {
        toast.error("Donor Name can only contain 20 alphabets.");
        return;
      }
      if (!phonePattern.test(updatedDonorData.phone)) {
        toast.error("Phone must be 10 digits.");
        return;
      }
      if (!emailPattern.test(updatedDonorData.email)) {
        toast.error("Email should be in the format user@gmail.com.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/admin/api/donor/${selectedDonor._id}`,
        updatedDonorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDonors((prevDonors) =>
        prevDonors.map((donor) =>
          donor._id === selectedDonor._id
            ? { ...donor, ...updatedDonorData }
            : donor
        )
      );
      toast.success("Donor updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        "Error updating donor:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update donor.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDonorData({
      ...updatedDonorData,
      [name]: value,
    });
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Donors"} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Donors" icon={UserPlus} value={totalDonors.toString()} color="#6366F1" />
          <StatCard name="Pending Donations" icon={Clock} value={pendingDonations.toString()} color="#F59E0B" />
          <StatCard name="Completed Donations" icon={CheckCircle} value={completedDonations.toString()} color="#10B981" />
        </motion.div>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search donors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-lg text-black"
          />
          <button
            onClick={downloadReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Download Report
          </button>
        </div>

        <div className="mt-8 shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor) => (
                <tr key={donor._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{donor.donorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{donor.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{donor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{donor.organ}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{donor.bloodGroup}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{donor.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{donor.status || "Pending"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(donor)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit className="inline-block h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(donor._id)}
                      className="text-red-500 hover:text-red-600 ml-4"
                    >
                      <Trash className="inline-block h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ToastContainer />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex justify-center items-center z-50">
          <form
            className="bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-lg text-black"
            onSubmit={handleSubmitEdit}
          >
            <h2 className="text-xl font-bold mb-4 text-white">Edit Donor</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="donorName"
                value={updatedDonorData.donorName}
                onChange={handleChange}
                placeholder="Donor Name"
                className="border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                name="phone"
                value={updatedDonorData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border px-4 py-2 rounded-lg"
              />
              <input
                type="email"
                name="email"
                value={updatedDonorData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border px-4 py-2 rounded-lg"
              />
              <select
                name="organ"
                value={updatedDonorData.organ}
                onChange={handleChange}
                placeholder="Organ"
                className="border px-4 py-2 rounded-lg"
              >
              <option value="Liver">Liver</option>
              <option value="Kidney">Kidney</option>
              <option value="Heart">Heart</option>
              <option value="Eyes">Eyes</option>
              <option value="Pancreas">Pancreas</option>
              <option value="Lungs">Lungs</option>
              </select>
              <select
                name="bloodGroup"
                value={updatedDonorData.bloodGroup}
                onChange={handleChange}
                placeholder="Blood Group"
                className="border px-4 py-2 rounded-lg"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>

              <select
                name="gender"
                value={updatedDonorData.gender}
                onChange={handleChange}
                className="border px-4 py-2 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-4"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default DonorsPage;