import { format } from "date-fns";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

function WeatherForecast({ weatherData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
      {weatherData?.map((day, index) => (
        <motion.div
          key={day.datetime}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-4 bg-white dark:bg-gray-700 p-4 rounded shadow"
        >
          {/* Weather Icon with Tooltip */}
          <img
            src={`/icons/${day.icon}.svg`}
            alt={day.conditions}
            className="w-12 h-12"
            data-tooltip-id={`icon-tooltip-${index}`}
            data-tooltip-content={day.conditions}
          />
          <Tooltip id={`icon-tooltip-${index}`} effect="solid" />

          <div className="flex-1">
            {/* Date */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(new Date(day.datetime), "EEEE, MMM d")}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              {day.description}
            </p>

            {/* Weather Details with Tooltip */}
            <div
              className="text-sm text-gray-700 dark:text-gray-200"
              data-tooltip-id={`details-tooltip-${index}`}
              data-tooltip-content={`Feels like: ${day.feelslike}°C\nCloud cover: ${day.cloudcover}%\nWind: ${day.windspeed} km/h`}
            >
              🌡️ {day.tempmin}°C – {day.tempmax}°C
              <br />
              💧 {day.humidity}% humidity &nbsp;|&nbsp; ☔ {day.precipprob}%
              rain
            </div>
            <Tooltip
              id={`details-tooltip-${index}`}
              effect="solid"
              multiline={true}
            />

            {/* Sunrise / Sunset */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              🌅 Sunrise: {day.sunrise} &nbsp;|&nbsp; 🌇 Sunset: {day.sunset}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default WeatherForecast;
