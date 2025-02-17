import axios from "axios";
import { useEffect, useState } from "react";

import AddDonor from "../add donar/add_donar";
import DonarList from "./DonarList";
import Filter from "./Filter";

const BloodDonorList = () => {
  const [donorData, setDonorData] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [addDonarModal, setAddDonarModal] = useState(false);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/blood/donors/");
        setDonorData(response.data);
      } catch (error) {
        console.error("Error fetching donor data:", error);
      }
    };

    fetchDonors();
  }, []);

  return (
    <div className="relative container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-700">
        Blood Donor List
      </h1>
      {addDonarModal && (
        <AddDonor
          setAddDonarModal={setAddDonarModal}
          setDonorData={setDonorData}
          donorData={donorData}
        />
      )}
      {/* Search and Filter */}
      <Filter
        setFilteredDonors={setFilteredDonors}
        donorData={donorData}
        setAddDonarModal={setAddDonarModal}
      />

      {/* Donor Table */}
      <DonarList filteredDonors={filteredDonors} donorData={donorData} setDonorData={setDonorData}/>
    </div>
  );
};

export default BloodDonorList;
