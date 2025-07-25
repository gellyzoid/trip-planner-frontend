import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { FiCalendar, FiFlag, FiMapPin } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import Select, { SingleValue, StylesConfig } from "react-select";
import { Tooltip } from "react-tooltip";
import { useTripPlanner } from "../contexts/TripPlannerContext";
import DateRange from "./DateRange";
import Location from "./Location";
import { darkStyles, lightStyles } from "../styles/styles";

const PURPOSE_GROUPS = [
  {
    label: "🧳 Leisure & Recreation",
    options: [
      { label: "Vacation", value: "vacation" },
      { label: "Beach Trip", value: "beach trip" },
      { label: "Road Trip", value: "road trip" },
      { label: "Camping", value: "camping" },
      { label: "Hiking", value: "hiking" },
      { label: "Backpacking", value: "backpacking" },
      { label: "Sightseeing", value: "sightseeing" },
      { label: "Festival or Concert", value: "festival or concert" },
      { label: "Spa Getaway", value: "spa getaway" },
    ],
  },
  {
    label: "💼 Work & Study",
    options: [
      { label: "Work Travel", value: "work travel" },
      { label: "Remote Work", value: "remote work" },
      { label: "Conference", value: "conference" },
      { label: "Business Meeting", value: "business meeting" },
      { label: "Study Abroad", value: "study abroad" },
      { label: "Research Expedition", value: "research expedition" },
    ],
  },
  {
    label: "🎉 Events & Occasions",
    options: [
      { label: "Wedding", value: "wedding" },
      { label: "Honeymoon", value: "honeymoon" },
      { label: "Birthday Celebration", value: "birthday celebration" },
      { label: "Family Reunion", value: "family reunion" },
      { label: "Bachelorette / Bachelor Party", value: "bachelorette party" },
    ],
  },
  {
    label: "🧘 Personal & Purpose-Driven",
    options: [
      { label: "Wellness Retreat", value: "wellness retreat" },
      { label: "Volunteering", value: "volunteering" },
      { label: "Visiting Family", value: "visiting family" },
      { label: "Relocation / Moving", value: "relocation" },
      { label: "Photography Trip", value: "photography trip" },
      { label: "Food & Culinary Tour", value: "culinary tour" },
    ],
  },
];

export interface SelectedLocation {
  display_name: string;
  name: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  id: number;
}

const TripPlannerForm = () => {
  const {
    result,
    weather,
    fetchPlaces,
    handlePlanRequest,
    setResult,
    setData,
    setWeather,
    loading,
    setIsOpen,
    setIsOpenWeather,
  } = useTripPlanner();

  const [days, setDays] = useState(0);
  const [purpose, setPurpose] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [finalStartDate, setFinalStartDate] = useState<Date | null>(null);
  const [finalEndDate, setFinalEndDate] = useState<Date | null>(null);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const hasDate = searchParams.has("start") && searchParams.has("end");

  const isDisabled =
    !searchParams.has("lat") ||
    !searchParams.has("lon") ||
    !hasDate ||
    Boolean(result);

  const name = selectedLocation?.name ?? "";
  const city = selectedLocation?.city ?? "";
  const region = selectedLocation?.region ?? "";
  const country = selectedLocation?.country ?? "";

  const locatedAt = `the ${name} located at ${city}, ${region}, ${country}`;
  const description = weather?.[0]?.description || "No description available";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!days || !purpose) {
      alert("Please fill out all fields.");
      return;
    }

    fetchPlaces(Number(lat), Number(lon));
    handlePlanRequest({
      days,
      purpose,
      destination: locatedAt,
      weatherDescription: description,
    });
  };

  const handleReset = () => {
    setDays(0);
    setPurpose("");
    setResult("");
    setData(null);
    setSearchParams({});
    setSelectedLocation(null);
    setStartDate(null);
    setEndDate(null);
    setFinalStartDate(null);
    setFinalEndDate(null);
    setWeather([]);
  };

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (start && end) {
      setStartDate(new Date(start));
      setEndDate(new Date(end));
    }
  }, []);

  return (
    <aside className="m-[1px] w-full md:w-1/3 md:max-w-sm p-6 border-r bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          ✈️ Plan Your Trip
        </h2>

        {/* Destination */}
        <div>
          <label
            htmlFor="destination"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
          >
            <FiMapPin className="text-blue-500" />
            Where is your destination?
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Enter a city, landmark, or country — we’ll help you pack.
          </p>
          <Location
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>

        {/* Date Range */}
        <div>
          <label
            htmlFor="date-range"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
          >
            <FiCalendar className="text-blue-500" />
            When are you going?
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Choose your travel period.
          </p>
          <DateRange
            setDays={setDays}
            endDate={endDate}
            startDate={startDate}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            selectedLocation={selectedLocation}
            finalStartDate={finalStartDate}
            finalEndDate={finalEndDate}
            setFinalEndDate={setFinalEndDate}
            setFinalStartDate={setFinalStartDate}
          />
        </div>

        {/* Purpose */}
        <div>
          <label
            htmlFor="purpose"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
          >
            <FiFlag className="text-blue-500" />
            Purpose of your trip
          </label>
          <Select
            options={PURPOSE_GROUPS}
            placeholder="e.g., Vacation"
            onChange={(option: SingleValue<{ label: string; value: string }>) =>
              setPurpose(option?.value || "")
            }
            styles={isDark ? darkStyles : lightStyles}
          />
        </div>

        {/* Destination Summary */}
        {selectedLocation && (
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 shadow-sm dark:bg-gray-700 dark:text-blue-300 mt-4">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-xl" />
              <div>
                <p className="text-sm font-semibold dark:text-blue-200">
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
                <Tooltip id="location-tooltip" place="top" />
                {endDate && (
                  <p className="text-sm mt-1">
                    ({format(new Date(startDate ?? ""), "MMM. dd yyyy")} –{" "}
                    {format(new Date(endDate), "MMM. dd yyyy")})
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-2 pt-2">
          <button
            type="submit"
            disabled={isDisabled}
            className={`text-white py-2 px-4 rounded w-full font-medium transition shadow-sm ${
              isDisabled
                ? "bg-gray-400 hover:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Generate Plan
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-600 w-full font-medium transition shadow-sm"
          >
            Reset
          </button>
        </div>

        {/* Quick Actions */}
        {!loading && result && (
          <div className="mt-6 border border-dashed border-gray-400 dark:border-gray-600 p-4 rounded-md bg-white/50 dark:bg-gray-800/50 transition-colors duration-300">
            <p className="text-xs font-semibold mb-3 text-gray-500 dark:text-gray-400 text-center">
              Quick Actions
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 rounded transition"
              >
                📍 View Landmarks
              </button>

              <button
                type="button"
                onClick={() => setIsOpenWeather(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700 rounded transition"
              >
                🌦️ Weather Forecast
              </button>
            </div>
          </div>
        )}
      </form>
    </aside>
  );
};

export default TripPlannerForm;
