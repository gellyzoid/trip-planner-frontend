import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import WeatherForecast from "./WeatherForecast";

function DrawerWeather({ data, isOpenWeather, handleCloseWeather }) {
  return (
    <Drawer open={isOpenWeather} onClose={handleCloseWeather} position="top">
      <DrawerHeader title="Weather Forecast" />
      <DrawerItems>
        <div className="max-h-[90vh] overflow-y-auto px-4">
          <WeatherForecast weatherData={data} />
        </div>
      </DrawerItems>
    </Drawer>
  );
}

export default DrawerWeather;
