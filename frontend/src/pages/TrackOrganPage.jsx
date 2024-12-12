import { useState, useEffect } from "react";
import { CheckCircle, Truck, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

const TrackDonorsPage = () => {
  const predefinedLocations = ["Chandigarh", "Patiala", "New Delhi", "Mumbai", "Pune"];
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({ name: "", pickupLocation: "", dropOffLocation: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch drivers from backend
  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/driver/drivers");
      setDrivers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name" && !/^[A-Za-z]*$/.test(value)) {
      setFormErrors({ ...formErrors, name: "Name must only contain alphabets." });
    } else {
      setFormErrors((prev) => {
        const { name, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleAddOrEditDriver = async () => {
    const { name, pickupLocation, dropOffLocation } = formData;

    if (!name || !pickupLocation || !dropOffLocation) {
      setFormErrors({ form: "All fields are required." });
      return;
    }

    if (editIndex !== null) {
      try {
        const updatedDriver = await axios.put(`http://localhost:5000/api/driver/drivers/${drivers[editIndex]._id}`, formData);
        const updatedDrivers = [...drivers];
        updatedDrivers[editIndex] = updatedDriver.data;
        setDrivers(updatedDrivers);
      } catch (error) {
        console.error("Error updating driver:", error);
      }
      setEditIndex(null);
    } else {
      try {
        const response = await axios.post("http://localhost:5000/api/driver/drivers", formData);
        setDrivers((prevDrivers) => [...prevDrivers, response.data]);
      } catch (error) {
        console.error("Error adding driver:", error);
      }
    }

    setFormData({ name: "", pickupLocation: "", dropOffLocation: "" });
    setIsFormVisible(false);
    setFormErrors({});
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setFormData({ name: "", pickupLocation: "", dropOffLocation: "" });
    setEditIndex(null);
    setFormErrors({});
  };

  const handleEditDriver = (index) => {
    setEditIndex(index);
    setFormData({ ...drivers[index] });
    setIsFormVisible(true);
  };

  const handleDeleteDriver = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/api/driver/drivers/${drivers[index]._id}`);
      setDrivers(drivers.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const handleShowAddDriverForm = () => {
    setIsFormVisible(true);
    setEditIndex(null);
    setFormData({ name: "", pickupLocation: "", dropOffLocation: "" });
    setFormErrors({});
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title="Track Donors" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Drivers" icon={Truck} value={drivers.length} color="#6366F1" />
          <StatCard name="Active Deliveries" icon={MapPin} value="3" color="#F59E0B" />
        </motion.div>

        <button
          onClick={handleShowAddDriverForm}
          disabled={isFormVisible}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Driver
        </button>

        {isFormVisible && (
          <div className="mb-8 bg-black shadow rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? "Edit Driver" : "Add Driver"}</h2>
            <form className="grid grid-cols-1 text-black sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter name"
                onChange={handleInputChange}
                className="border rounded p-2"
              />
              {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}

              <select
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                className="border rounded p-2"
              >
                <option value="">Select Pickup Location</option>
                {predefinedLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                name="dropOffLocation"
                value={formData.dropOffLocation}
                onChange={handleInputChange}
                className="border rounded p-2"
              >
                <option value="">Select Drop-Off Location</option>
                {predefinedLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              {formErrors.form && <p className="text-red-500 text-xs col-span-2">{formErrors.form}</p>}

              <div className="flex justify-between items-center col-span-2">
                <button
                  type="button"
                  onClick={handleAddOrEditDriver}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  {editIndex !== null ? "Update Driver" : "Add Driver"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white p-2 rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Drivers Table */}
        <div className="mt-8 shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full text-sm text-left text-gray-900">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 font-semibold">Driver Name</th>
                <th className="py-3 px-6 font-semibold">Pickup Location</th>
                <th className="py-3 px-6 font-semibold">Drop-Off Location</th>
                <th className="py-3 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    Loading...
                  </td>
                </tr>
              ) : (
                drivers.map((driver, index) => (
                  <tr key={index} className="border-b cursor-pointer">
                    <td className="py-3 text-white px-6">{driver.name}</td>
                    <td className="py-3 px-6 text-white">{driver.pickupLocation}</td>
                    <td className="py-3 px-6 text-white">{driver.dropOffLocation}</td>
                    <td className="py-3 px-6">
                      <button onClick={() => handleEditDriver(index)} className="text-blue-500 mr-2">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteDriver(index)} className="text-red-500">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TrackDonorsPage;