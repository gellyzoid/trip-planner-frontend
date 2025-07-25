import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import WeatherForecast from "./WeatherForecast";
import { useTripPlanner } from "../contexts/TripPlannerContext";

function DrawerWeather() {
  const { isOpenWeather, setIsOpenWeather, weather } = useTripPlanner();

  const handleClose = () => {
    setIsOpenWeather(false);
  };

  return (
    <Drawer open={isOpenWeather} onClose={handleClose} position="top">
      <DrawerHeader title="Weather Forecast" />
      <DrawerItems>
        <div className="max-h-[90vh] overflow-y-auto px-4">
          <WeatherForecast weatherData={weather} />
        </div>
      </DrawerItems>
    </Drawer>
  );
}

export default DrawerWeather;
