import { FaSuitcaseRolling } from "react-icons/fa";
import DarkToggle from "./DarkToggle";

function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl">
        <FaSuitcaseRolling />
        TripPlanner
      </div>

      {/* Right: Toggle + Ko-fi */}
      <div className="flex items-center gap-4">
        <DarkToggle />
        <a
          href="https://ko-fi.com/D1D516MDN6"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            height={36}
            style={{ height: 36 }}
            src="https://storage.ko-fi.com/cdn/kofi1.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </div>
    </nav>
  );
}

export default NavBar;
