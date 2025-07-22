import { useState } from "react";
import DrawerPlaceList from "./DrawerPlaceList";
import DrawerWeather from "./DrawerWeather";
import Hero from "./Hero";
import MainLayout from "./MainLayout";
import NavBar from "./NavBar";

function Home() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenWeather, setIsOpenWeather] = useState(false);

  const handleCloseWeather = () => setIsOpenWeather(false);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      <NavBar />
      <DrawerPlaceList data={data} isOpen={isOpen} handleClose={handleClose} />
      <DrawerWeather
        data={weather}
        isOpenWeather={isOpenWeather}
        handleCloseWeather={handleCloseWeather}
      />

      <MainLayout
        setLoading={setLoading}
        setResult={setResult}
        loading={loading}
        result={result}
        data={data}
        setData={setData}
        setIsOpen={setIsOpen}
        weather={weather}
        setWeather={setWeather}
        setIsOpenWeather={setIsOpenWeather}
      />
    </div>
  );
}

export default Home;
