import DonarForm from "./add_donar_form";

const AddDonor = ({ setAddDonarModal, setDonorData, donorData }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60 z-50">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-[500px] ">
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-4">
          Add New Donor
        </h2>
        <DonarForm
          setAddDonarModal={setAddDonarModal}
          setDonorData={setDonorData}
          donorData={donorData}
        />

        <button
          onClick={() => setAddDonarModal(false)}
          className="mt-4 w-full text-red-500 hover:text-red-700 font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddDonor;
