import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const DarkToggle = () => {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="text-xl p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle Dark Mode"
    >
      {dark ? <FiSun /> : <FiMoon />}
    </button>
  );
};

export default DarkToggle;
