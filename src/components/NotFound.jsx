import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-9xl font-bold text-yellow-500 dark:text-yellow-400">
        404
      </h1>
      <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-slate-200 mt-4">
        Oops! Page not found
      </p>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-2 px-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <NavLink
        to="/"
        className="mt-6 bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg dark:bg-yellow-400 dark:hover:bg-yellow-500 transition"
      >
        Go back home
      </NavLink>
    </div>
  );
}

export default NotFound;
