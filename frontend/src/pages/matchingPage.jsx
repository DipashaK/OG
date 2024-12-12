import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from "../components/common/Header";

const MatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recipients and donors from the backend
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No token found.');
        return;
      }

      const recipientResponse = await axios.get(
        'http://localhost:5000/api/admin/r',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const donorResponse = await axios.get('http://localhost:5000/api/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipients(recipientResponse.data);
      setDonors(donorResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch recipients and donors.');
    } finally {
      setIsLoading(false);
    }
  };

  // Match donors and recipients based on organ and blood group
  const matchDonorsAndRecipients = () => {
    const pairedMatches = [];

    // Loop through recipients and find matching donors
    recipients.forEach((recipient) => {
      const matchingDonor = donors.find(
        (donor) =>
          donor.organ === recipient.organ &&
          donor.bloodGroup === recipient.bloodGroup && 
          donor.status === "Pending" && recipient.status === "Pending"
      );

      if (matchingDonor) {
        pairedMatches.push({
          donor: matchingDonor,
          receiver: recipient,
        });
      }
    });

    setMatches(pairedMatches);
  };

  const handleMatchConfirm = async (donorId, receiverId) => {
    try {
      // Send match email
      await axios.post('http://localhost:5000/api/matches/send-match-email', { donorId, receiverId });
  
      // Update the status of donor and receiver to 'Approved'
      await axios.post('http://localhost:5000/api/matches/api/matches/approve', { donorId, receiverId });
  
      toast.success('Match email sent and status updated to Approved!');
      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.donor._id !== donorId)
      );
    } catch (error) {
      console.error('Error processing match:', error);
      toast.error('Failed to send match email or update status.');
    }
  };

  

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (recipients.length && donors.length) {
      matchDonorsAndRecipients();
    }
  }, [recipients, donors]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 relative z-10 overflow-auto">
    <Header title={"Matching Donors Recievers"} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="mt-8 shadow-lg rounded-lg overflow-hidden mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Matched Donors and Receivers
          </h2>

          {matches.length > 0 ? (
            <table className="min-w-full text-sm text-left text-gray-900">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 font-semibold">Donor Name</th>
                  <th className="py-3 px-6 font-semibold">Receiver Name</th>
                  <th className="py-3 px-6 font-semibold">Organ</th>
                  <th className="py-3 px-6 font-semibold">Blood Group</th>
                  <th className="py-3 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, index) => (
                  <tr key={index} className="border-b cursor:pointer text-white">
                    <td className="py-3 px-6">{match.donor?.donorName || 'N/A'}</td>
                    <td className="py-3 px-6">
                      {match.receiver?.receiverName || 'No receiver available'}
                    </td>
                    <td className="py-3 px-6">{match.donor?.organ || 'N/A'}</td>
                    <td className="py-3 px-6">{match.donor?.bloodGroup || 'N/A'}</td>
                    <td className="py-3 px-6">
                      {match.receiver ? (
                        <button
                          className="text-green-500 hover:text-green-600 focus:outline-none"
                          onClick={() =>
                            handleMatchConfirm(match.donor._id, match.receiver._id)
                          }
                        >
                          Confirm Match
                        </button>
                      ) : (
                        <span className="text-gray-500">No action available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No matches found.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MatchingPage;