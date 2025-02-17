import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles for the toast
import { useAxios } from "../../hooks/useAxios";

export default function DonarForm({
  setAddDonarModal,
  setDonorData,
  donorData,
}) {
  const [formData, setFormData] = useState({
    name: "",
    blood_type: "",
    contact_number: "",
    location: "",
    last_donation_date: "",
    total_blood_donated: 0,
  });
  const [contactNumberError, setContactNumberError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { api } = useAxios();

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/blood/create-donor/", formData);

      if (response.status === 201) {
        setDonorData([...donorData, formData]);
        setFormData({
          name: "",
          blood_type: "",
          contact_number: "",
          location: "",
          last_donation_date: "",
          total_blood_donated: 0,
        });
        setAddDonarModal(false);
        toast.success("Donor added successfully!"); // Success toast
      } else {
        toast.error("Failed to add donor."); // Error toast
      }
    } catch (err) {
      if (err.response?.data?.contact_number) {
        toast.error(
          err.response.data.contact_number[0] || "Error adding donor."
        );
        setContactNumberError(err.response.data.contact_number[0]);
      } else {
        toast.error("Error adding donor.");
      }

      // Error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Donor Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter donor name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Blood Group
          </label>
          <select
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>
              Select Blood Group
            </option>
            {bloodTypes.map((bloodType) => (
              <option key={bloodType} value={bloodType}>
                {bloodType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Contact Number
          </label>
          <input
            type="text"
            name="contact_number"
            placeholder="Enter contact number"
            value={formData.contact_number}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {contactNumberError && (
            <div className="text-red-500 text-sm mt-1">
              {contactNumberError}
            </div>
          )}{" "}
          {/* Show error message */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Last Donation Date
          </label>
          <input
            type="date"
            name="last_donation_date"
            value={formData.last_donation_date}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Total Blood Donated
          </label>
          <input
            type="number"
            name="total_blood_donated"
            placeholder="Enter total blood donated"
            value={formData.total_blood_donated}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="0"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Adding Donor..." : "Add Donor"}
        </button>
      </form>
    </>
  );
}
