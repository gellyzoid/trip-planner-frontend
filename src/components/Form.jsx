import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import TripPlannerForm from "./TripPlannerForm";
import { format } from "date-fns";

function Form({
  setResult,
  setLoading,
  loading,
  result,
  resultRef,
  data,
  setData,
  setIsOpen,
  weather,
  setWeather,
  setIsOpenWeather,
}) {
  const handlePlanRequest = async ({
    days,
    purpose,
    destination,
    weatherDescription,
  }) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.angelvictorio.com/api/qna/ask?days=${days}&purpose=${encodeURIComponent(
          purpose
        )}&destination=${encodeURIComponent(
          destination
        )}&weather=${encodeURIComponent(weatherDescription)}`
      );
      const raw = await res.text();
      const parsed = JSON.parse(raw);
      const content = parsed.choices?.[0]?.message?.content || "No response.";
      setResult(content);
    } catch (err) {
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async (latValue, lonValue) => {
    try {
      const response = await fetch(
        `https://api.angelvictorio.com/api/places?lat=${latValue}&lon=${lonValue}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setData(data.results);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const fetchWeather = async (latValue, lonValue, startDate, endDate) => {
    try {
      const response = await fetch(
        `https://api.angelvictorio.com/api/weather?lat=${latValue}&lon=${lonValue}&start=${format(
          startDate,
          "yyyy-MM-dd"
        )}&end=${format(endDate, "yyyy-MM-dd")}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setWeather(data.days);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const downloadPDF = async () => {
    const input = resultRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("packing-list.pdf");
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* 📝 Form Section */}
        <div className="md:w-1/2 w-full">
          <TripPlannerForm
            onSubmit={handlePlanRequest}
            onSubmitLandmarks={fetchPlaces}
            onSubmitWeather={fetchWeather}
            setResult={setResult}
            location={data}
            setData={setData}
            setIsOpen={setIsOpen}
            result={result}
            weather={weather}
            setWeather={setWeather}
          />
        </div>

        {/* 📋 Result Section */}
        <div className="md:w-1/2 w-full">
          {loading && (
            <p className="mt-6 text-center text-blue-500 dark:text-blue-300 font-medium">
              Generating your list...
            </p>
          )}

          {!loading && !result && (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-8 text-center text-gray-500 dark:text-gray-400 space-y-4 shadow-sm bg-white dark:bg-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-500 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17v-6h13v6M9 5h13v6H9M5 13H4a2 2 0 00-2 2v3h7v-3a2 2 0 00-2-2H5z"
                />
              </svg>

              <div>
                <h3 className="text-lg font-semibold">
                  Ready to plan your trip?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill in your destination and travel dates. We’ll generate a
                  smart packing list, highlight landmarks, and even show you the
                  weather.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs dark:bg-blue-800 dark:text-blue-200">
                  🧳 Packing List
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs dark:bg-green-800 dark:text-green-200">
                  📍 Landmarks
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs dark:bg-yellow-800 dark:text-yellow-200">
                  🌦️ Weather Forecast
                </span>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                Waiting for your input to start planning...
              </p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded shadow-md"
            >
              <h2 className="font-semibold text-lg mb-3">
                Suggested Packing List
              </h2>

              <div
                ref={resultRef}
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-slate-200 dark:bg-gray-800">
                  {result}
                </pre>
              </div>

              {/* 📦 Action Buttons */}
              <div className="flex justify-between flex-wrap mt-4 gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    View Landmarks
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpenWeather(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    View Weather Forecast
                  </button>
                </div>

                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Download PDF
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}

export default Form;
