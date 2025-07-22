import { format } from "date-fns";
import { motion } from "framer-motion";
import AIResult from "./AIResult";
import TripPlannerForm from "./TripPlannerForm";

function MainLayout({
  setResult,
  setLoading,
  loading,
  result,
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
      console.log({ days, purpose, destination, weatherDescription });
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

  return (
    <div className="h-screen">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row h-full md:max-w-2/3 mx-auto antialiased text-gray-800 dark:text-gray-100"
      >
        {/* 📝 Form Section */}

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
          setIsOpenWeather={setIsOpenWeather}
          loading={loading}
        />

        {/* 📋 Result Section */}
        <AIResult loading={loading} result={result} />
      </motion.section>
    </div>
  );
}

export default MainLayout;
