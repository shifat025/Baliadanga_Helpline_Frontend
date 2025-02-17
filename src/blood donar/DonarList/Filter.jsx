import { useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

export default function Filter({
  donorData,
  setFilteredDonors,
  setAddDonarModal,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const { auth } = useAuth();
 

  useEffect(() => {
    const filteredDonor = donorData?.filter((donor) => {
      const matchesSearch =
        donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor?.blood_type?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && donor.is_available) ||
        (availabilityFilter === "notAvailable" && !donor.is_available);

      return matchesSearch && matchesAvailability;
    });

    setFilteredDonors(filteredDonor);
  }, [searchTerm, availabilityFilter, donorData, setFilteredDonors]);

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or blood group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Availability Filter */}
        <div className="relative w-full sm:w-48">
          <FaFilter className="absolute left-3 top-3 text-gray-500" />
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="all">All Donors</option>
            <option value="available">Available</option>
            <option value="notAvailable">Not Available</option>
          </select>
        </div>
      </div>

      {/* Add Donor Button */}

      {auth?.user?.role === "blood_secretary" ? (
        <button
          onClick={() => setAddDonarModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition"
        >
          Add Donor
        </button>
      ) : null}
    </div>
  );
}
