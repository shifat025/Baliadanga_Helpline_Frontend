import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import { useAxios } from "../../hooks/useAxios";

export default function DonarList({ filteredDonors, donorData, setDonorData }) {
  const [editingDonorId, setEditingDonorId] = useState(null);
  const [editedDonorData, setEditedDonorData] = useState({
    total_blood_donated: "",
    last_donation_date: "",
  });
  const { api } = useAxios();

  // Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEditClick = (donor) => {
    setEditingDonorId(donor.id);
    setEditedDonorData({
      total_blood_donated: donor.total_blood_donated,
      last_donation_date: donor.last_donation_date,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDonorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = async (donorId) => {
    // Check if both fields are filled
    if (
      !editedDonorData.total_blood_donated &&
      !editedDonorData.last_donation_date
    ) {
      toast.error("Both fields are required to update the donor data.");
      return; // Prevent update if fields are empty
    }

    // Check if the new data is different from the old data
    const donor = donorData.find((donor) => donor.id === donorId);

    // If one field is changed but not the other, show an error
    if (
      (donor.total_blood_donated === editedDonorData.total_blood_donated &&
        donor.last_donation_date !== editedDonorData.last_donation_date) ||
      (donor.total_blood_donated !== editedDonorData.total_blood_donated &&
        donor.last_donation_date === editedDonorData.last_donation_date)
    ) {
      toast.info("Both fields must be changed to update the donor data.");
      return; // Prevent update if only one field is changed
    }

    setLoading(true); // Set loading to true when request starts
    setError(null); // Reset previous error

    try {
      const response = await api.patch(
        `/blood/donors/${donorId}/update/`,
        editedDonorData
      );

      if (response.status === 200) {
        toast.success("Donor data updated successfully"); // Success toast
        setDonorData(
          donorData.map((donor) =>
            donor.id === donorId ? { ...donor, ...editedDonorData } : donor
          )
        );

        setEditingDonorId(null);
      } else {
        toast.error("Failed to update donor data"); // Error toast
      }
    } catch (error) {
      setError(error);
      toast.error("Error updating donor data"); // Error toast on catch
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const handleCancelClick = () => {
    setEditingDonorId(null); // Exit edit mode without saving changes
    setEditedDonorData({
      total_blood_donated: "",
      last_donation_date: "",
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <table className="min-w-full border-collapse">
        <thead className="bg-indigo-600 text-white">
          <tr>
            {[
              "Name",
              "Blood Group",
              "Total Donations",
              "Contact Number",
              "Last Donation",
              "Availability",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredDonors.map((donor) => (
            <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {donor.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {donor.blood_type}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {editingDonorId === donor.id ? (
                  <input
                    type="number"
                    name="total_blood_donated"
                    value={editedDonorData.total_blood_donated}
                    onChange={handleInputChange}
                    className="px-2 py-1 border border-gray-300 rounded-md"
                  />
                ) : (
                  donor.total_blood_donated
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {donor.contact_number}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {editingDonorId === donor.id ? (
                  <input
                    type="date"
                    name="last_donation_date"
                    value={editedDonorData.last_donation_date}
                    onChange={handleInputChange}
                    className="px-2 py-1 border border-gray-300 rounded-md"
                  />
                ) : (
                  donor.last_donation_date
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    donor.is_available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {donor.is_available ? "Available" : "Not Available"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                {editingDonorId === donor.id ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSaveClick(donor.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-all duration-200"
                      disabled={loading} // Disable save button while loading
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(donor)}
                    className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 flex items-center transition-all duration-200"
                  >
                    <FaEdit className="mr-2" /> Update
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
