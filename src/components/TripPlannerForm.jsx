import { format } from "date-fns";
import { useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import DateRange from "./DateRange";
import Location from "./Location";

const PURPOSE_OPTIONS = [
  "Camping",
  "Swimming",
  "Vacation",
  "Work travel",
  "Road trip",
  "Hiking",
  "Beach trip",
  "Conference",
  "Backpacking",
  "Visiting family",
  "Retreat",
];

const TripPlannerForm = ({
  onSubmit,
  onReset,
  result,
  setResult,
  data,
  setData,
  onSubmitLandmarks,
  onSubmitWeather,
  setWeather,
  weather,
}) => {
  const [days, setDays] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [startDate, setStartDate] = useState(searchParams.get("start") || null);
  const [endDate, setEndDate] = useState(searchParams.get("end") || null);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const hasDate = searchParams.has("start") && searchParams.has("end");

  const isDisabled =
    !searchParams.has("lat") || !searchParams.has("lon") || !hasDate || result;

  const { name, city, region, country } = selectedLocation || [];

  const locatedAt = `the ${name} located at ${city}, ${region}, ${country}`;
  const description = weather?.[0]?.description || "No description available";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!days || !purpose) {
      alert("Please fill out all fields.");
      return;
    }

    onSubmitLandmarks(Number(lat), Number(lon));
    onSubmit({
      days,
      purpose,
      destination: locatedAt,
      weatherDescription: description,
    });
  };

  const handleReset = () => {
    setDays("");
    setPurpose("");
    onReset?.(); // optional: call parent to clear result
    setResult("");
    setData([]);
    setSearchParams({});
    setSelectedLocation(null);
    setStartDate(null);
    setEndDate(null);
    setWeather([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl"
    >
      <div>
        <label
          htmlFor="destination"
          className="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100"
        >
          Where is your destination?
        </label>
        <Location
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          data={data}
          setData={setData}
        />

        <DateRange
          setDays={setDays}
          days={days}
          endDate={endDate}
          startDate={startDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          selectedLocation={selectedLocation}
          onSubmitWeather={onSubmitWeather}
        />
      </div>

      <div>
        <label
          htmlFor="purpose"
          className="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100"
        >
          Purpose of your trip
        </label>
        <select
          id="purpose"
          required
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="">-- Select Purpose --</option>
          {PURPOSE_OPTIONS.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {selectedLocation !== null && (
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 shadow-sm dark:bg-gray-700 dark:text-blue-300">
          <div className="flex items-center gap-3">
            <FiMapPin className="text-xl" />
            <div>
              <p className="text-sm font-semibold dark:text-blue-400">
                Your destination
              </p>

              <span
                data-tooltip-id="location-tooltip"
                data-tooltip-content={selectedLocation.display_name}
                className="text-base cursor-help"
              >
                {selectedLocation.name ||
                  selectedLocation.display_name?.split(",")[0]}
              </span>
              <Tooltip
                id="location-tooltip"
                effect="solid"
                multiline={true}
                place="top"
              />

              {endDate && (
                <p className="text-base">
                  ( {format(new Date(startDate), "MMM. dd yyyy")} to{" "}
                  {format(new Date(endDate), "MMM. dd yyyy")} )
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-2">
        <button
          type="submit"
          className={`text-white py-2 px-4 rounded w-full ${
            isDisabled
              ? "bg-gray-400 hover:bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointe"
          }`}
          disabled={isDisabled}
        >
          Generate Plan
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-600 w-full"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default TripPlannerForm;
