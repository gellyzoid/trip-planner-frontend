import { addMonths, differenceInDays, format } from "date-fns";
import { HR } from "flowbite-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

function DateRange({
  days,
  setDays,
  endDate,
  startDate,
  setEndDate,
  setStartDate,
  selectedLocation,
  onSubmitWeather,
  finalStartDate,
  setFinalStartDate,
  finalEndDate,
  setFinalEndDate,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const isFinalDate = endDate && startDate;

  const difference = differenceInDays(endDate, startDate);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const currentParams = Object.fromEntries([...searchParams.entries()]);
    if (selectedLocation) {
      setSearchParams({
        ...currentParams,
        start: format(startDate, "yyyy-MM-dd"),
        end: format(endDate, "yyyy-MM-dd"),
      });

      setFinalStartDate(startDate);
      setFinalEndDate(endDate);
      onSubmitWeather(
        selectedLocation.lat,
        selectedLocation.lon,
        startDate,
        endDate
      );
    } else {
      Swal.fire({
        icon: "info",
        text: "Please enter your destination.",
        showConfirmButton: true,
      });
    }
  };

  if (difference >= 15) {
    Swal.fire({
      icon: "info",
      text: "Due to free tier limitations, you can only select up to 15 days.",
      showConfirmButton: true,
    });
    setStartDate(null);
    setEndDate(null);
    setDays(0);
  } else if (difference <= 15 && isFinalDate) {
    setDays(difference + 1);
  }

  return (
    <>
      <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">
        Travel Dates
        {difference !== null && (
          <span className="ml-2 text-blue-500 font-medium">
            {`${endDate ? `(${difference + 1} days)` : ""}`}
          </span>
        )}
      </label>

      {/* Readonly Date Range Display */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <input
          type="text"
          readOnly
          value={startDate ? format(startDate, "MMM. dd, yyyy") : ""}
          className="w-full max-w-[150px] px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <span className="text-lg text-gray-600 dark:text-gray-400">→</span>
        <input
          type="text"
          readOnly
          value={endDate ? format(endDate, "MMM. dd, yyyy") : ""}
          className="w-full max-w-[150px] px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      {startDate && endDate && (
        <>
          <HR className="mb-3" />
          <div className="flex items-end justify-end gap-3">
            <button
              className={`px-4 py-2 text-white rounded ${
                finalStartDate && finalEndDate
                  ? "bg-green-800 hover:bg-green-900 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-600 cursor-pointer"
              }`}
              onClick={handleConfirm}
              disabled={finalStartDate && finalEndDate}
            >
              {finalStartDate && finalEndDate ? "Confirmed" : "Confirm"}
            </button>

            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("start");
                newParams.delete("end");
                setSearchParams(newParams);
                setFinalEndDate(null);
                setFinalStartDate(null);
                setStartDate(null);
                setEndDate(null);
                setDays(0);
              }}
            >
              Change
            </button>
          </div>
        </>
      )}

      {!endDate && (
        <div className="flex justify-center items-center mt-6">
          <DatePicker
            selected={startDate}
            onChange={onChange}
            minDate={new Date()}
            maxDate={addMonths(new Date(), 5)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            showDisabledMonthNavigation
          />
        </div>
      )}
    </>
  );
}

export default DateRange;
