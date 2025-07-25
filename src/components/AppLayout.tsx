import DrawerPlaceList from "./DrawerPlaceList";
import DrawerWeather from "./DrawerWeather";
import Main from "./Main";
import NavBar from "./NavBar";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      <NavBar />
      <DrawerPlaceList />
      <DrawerWeather />
      <Main />
    </div>
  );
}

export default AppLayout;
