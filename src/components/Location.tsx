import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "flowbite-react";
import SearchResult from "./SearchResult";

function Location({ selectedLocation, setSelectedLocation }) {
  const [searchParams, setSearchParams] = useSearchParams("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const initialSearch = searchParams.get("location") || "";
  const [searchName, setSearchName] = useState(initialSearch);
  const [searchResult, setSearchResult] = useState("");
  const [openModal, setOpenModal] = useState(false);

  function handleChange(e) {
    const value = e.target.value;
    setSearchName(value);

    const currentParams = Object.fromEntries([...searchParams.entries()]);
    setSearchParams({
      ...currentParams,
      location: value,
    });
  }

  const handleDisabledClick = () => {
    if (selectedLocation) {
      Swal.fire({
        icon: "info",
        title: "Input disabled",
        text: "Please clear the selected location first.",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  async function fetchLocation(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchParams.get(
          "location"
        )}&addressdetails=1`
      );
      const data = await res.json();
      setSearchResult(data);

      if (!isLoading) setOpenModal(true);

      if (data.length === 0 || data === null) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Location not found!",
        });
        setOpenModal(false);
        searchParams.delete("location");
        setSearchName("");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
        setError("Failed to fetch data");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6 w-full">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <div onClick={handleDisabledClick}>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search location..."
              required
              onChange={handleChange}
              value={searchName}
              readOnly={selectedLocation}
            />
          </div>

          {selectedLocation ? (
            <button
              className="text-white absolute end-2.5 bottom-2.5 bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
              onClick={(e) => {
                e.preventDefault();
                setSelectedLocation(null);
                setSearchName("");

                const newParams = new URLSearchParams(searchParams);
                newParams.delete("location");
                newParams.delete("lat");
                newParams.delete("lon");
                setSearchParams(newParams);
              }}
            >
              Clear
            </button>
          ) : (
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 flex items-center justify-center gap-2"
              disabled={!searchParams.get("location") || isLoading}
              onClick={fetchLocation}
            >
              {isLoading ? (
                <Spinner aria-label="Loading" className="w-4 h-4" />
              ) : (
                "Search"
              )}
            </button>
          )}
        </div>
      </div>

      <Modal
        className="backdrop-blur-sm"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <ModalHeader>
          {searchResult.length !== 0 && (
            <p className="text-stone-800 dark:text-slate-200">
              {searchResult.length} Search result
              {searchResult.length !== 1 && "s"}
            </p>
          )}
        </ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <SearchResult
            searchResult={searchResult}
            setSelectedLocation={setSelectedLocation}
            setOpenModal={setOpenModal}
            setSearchName={setSearchName}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Location;
