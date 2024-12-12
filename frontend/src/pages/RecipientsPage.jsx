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

const RecipientsPage = () => {
  const [recipients, setRecipients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [updatedRecipientData, setUpdatedRecipientData] = useState({
    recipientName: "",
    phone: "",
    email: "",
    organ: "",
    bloodGroup: "",
    gender: "",
  });

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No token found.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/admin/r", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipients(response.data);
      } catch (error) {
        console.error(
          "Error fetching recipients:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchRecipients();
  }, []);

  const filteredRecipients = recipients.filter((recipient) =>
    Object.values(recipient)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalRecipients = recipients.length;
  const pendingRecipients = recipients.filter((recipient) => recipient.status === "Pending").length;
  const completedRecipients = recipients.filter((recipient) => recipient.status !== "Pending").length;

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Recipient Report", 14, 20);

    const tableColumn = [
      "Recipient Name",
      "Phone",
      "Email",
      "Organ",
      "Blood Group",
      "Gender",
      "Status",
    ];
    const tableRows = recipients.map((recipient) => [
      recipient.receiverName,
      recipient.phone,
      recipient.email,
      recipient.organ,
      recipient.bloodGroup,
      recipient.gender,
      recipient.status || "Pending",
    ]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    doc.save("recipients_report.pdf");
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No token found.");
        toast.error("Authorization token missing. Please log in again.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/admin/api/reciever/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipients((prevRecipients) => prevRecipients.filter((recipient) => recipient._id !== id));
      toast.success("Recipient deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting recipient:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to delete recipient.");
    }
  };

  const handleEdit = (recipient) => {
    setSelectedRecipient(recipient);
    setUpdatedRecipientData({
      recipientName: recipient.receiverName,
      phone: recipient.phone,
      email: recipient.email,
      organ: recipient.organ,
      bloodGroup: recipient.bloodGroup,
      gender: recipient.gender,
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

      if (!namePattern.test(updatedRecipientData.receiverName)) {
        toast.error("Recipient Name can only contain 20 alphabets.");
        return;
      }
      if (!phonePattern.test(updatedRecipientData.phone)) {
        toast.error("Phone must be 10 digits.");
        return;
      }
      if (!emailPattern.test(updatedRecipientData.email)) {
        toast.error("Email should be in the format user@gmail.com.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/admin/api/reciever/${selectedRecipient._id}`,
        updatedRecipientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipients((prevRecipients) =>
        prevRecipients.map((recipient) =>
          recipient._id === selectedRecipient._id
            ? { ...recipient, ...updatedRecipientData }
            : recipient
        )
      );
      toast.success("Recipient updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        "Error updating recipient:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update recipient.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRecipientData({
      ...updatedRecipientData,
      [name]: value,
    });
  };

//   return (
//     <div className="flex-1 relative z-10 overflow-auto">
//       <Header title={"Recipients"} />
//       <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
//         <motion.div
//           className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//         >
//           <StatCard name="Total Recipients" icon={UserPlus} value={totalRecipients.toString()} color="#6366F1" />
//           <StatCard name="Pending Recipients" icon={Clock} value={pendingRecipients.toString()} color="#F59E0B" />
//           <StatCard name="Completed Recipients" icon={CheckCircle} value={completedRecipients.toString()} color="#10B981" />
//         </motion.div>

//         <div className="flex justify-between mb-4">
//           <input
//             type="text"
//             placeholder="Search recipients..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border px-4 py-2 rounded-lg text-black"
//           />
//           <button
//             onClick={downloadReport}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
//           >
//             Download Report
//           </button>
//         </div>

//         <div className="mt-8 shadow-lg rounded-lg overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organ</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRecipients.map((recipient) => (
//                 <tr key={recipient._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{recipient.receiverName}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.phone}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.organ}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.bloodGroup}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.gender}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.status || "Pending"}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
//                     <button onClick={() => handleEdit(recipient)} className="text-blue-600 hover:text-blue-900 mr-3">
//                       <Edit size={16} />
//                     </button>
//                     <button onClick={() => handleDelete(recipient._id)} className="text-red-600 hover:text-red-900">
//                       <Trash size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//       <ToastContainer />
//       {isEditModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//   <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
//     <h2 className="text-2xl font-semibold mb-4 text-gray-900">Edit Recipient</h2>
//     <form onSubmit={handleSubmitEdit}>
//       {["receiverName", "phone", "email", "organ", "bloodGroup", "gender"].map((field) => (
//         <div className="mb-4" key={field}>
//           <label className="block text-sm font-medium text-white capitalize">{field}</label>
//           <input
//             type={field === "email" ? "email" : "text"}
//             name={field}
//             value={updatedRecipientData[field]}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md text-black"
//             placeholder={`Enter ${field}`}
//             required
//           />
//         </div>
//       ))}
//       <div className="mt-6 flex justify-end">
//         <button
//           type="button"
//           className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-4"
//           onClick={() => setIsEditModalOpen(false)}
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//         >
//           Save Changes
//         </button>
//       </div>
//     </form>
//   </div>
// </div>
// )}
//     </div>
//   );
// };

return (
  <div className="flex-1 relative z-10 overflow-auto">
    <Header title={"Recipients"} />
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard name="Total Recipients" icon={UserPlus} value={totalRecipients.toString()} color="#6366F1" />
        <StatCard name="Pending Recipients" icon={Clock} value={pendingRecipients.toString()} color="#F59E0B" />
        <StatCard name="Completed Recipients" icon={CheckCircle} value={completedRecipients.toString()} color="#10B981" />
      </motion.div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search recipients..."
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
            {filteredRecipients.map((recipient) => (
              <tr key={recipient._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{recipient.receiverName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.organ}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.bloodGroup}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{recipient.status || "Pending"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <button onClick={() => handleEdit(recipient)} className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(recipient._id)} className="text-red-600 hover:text-red-900">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
    <ToastContainer />
    {isEditModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Edit Recipient</h2>
          <form onSubmit={handleSubmitEdit}>
            {["receiverName", "phone", "email"].map((field) => (
              <div className="mb-4" key={field}>
                <label className="block text-sm font-medium text-white capitalize">{field}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={updatedRecipientData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-black"
                  placeholder={`Enter ${field}`}
                  required
                />
              </div>
            ))}

            {/* Organ Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Organ</label>
              <select
                name="organ"
                value={updatedRecipientData.organ}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-black"
                required
              >
                <option value="">Select Organ</option>
                <option value="liver">Liver</option>
                <option value="heart">Heart</option>
                <option value="kidney">Kidney</option>
                <option value="pancreas">Pancreas</option>
              </select>
            </div>

            {/* Blood Group Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Blood Group</label>
              <select
                name="bloodGroup"
                value={updatedRecipientData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-black"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A-">A-</option>
                <option value="A+">A+</option>
                <option value="B-">B-</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB-">AB-</option>
                <option value="AB+">AB+</option>
              </select>
            </div>

            {/* Gender Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Gender</label>
              <select
                name="gender"
                value={updatedRecipientData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-black"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
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
      </div>
    )}
  </div>
);
}

export default RecipientsPage;
