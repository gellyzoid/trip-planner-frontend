import { useSearchParams } from "react-router-dom";

function SearchResult({
  searchResult,
  setSelectedLocation,
  setOpenModal,
  setSearchName,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="px-4 py-3 border-b dark:border-gray-700">
      <div className="flex flex-col items-center w-full">
        {searchResult.map((result) => (
          <div
            className="bg-white dark:bg-slate-800 border dark:border-gray-600 rounded-md shadow-sm p-4 mb-3 w-full transition hover:shadow-md"
            key={result.place_id}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-800 dark:text-slate-200">
                {result.display_name}
              </p>
              <button
                className="ml-4 rounded-md bg-yellow-500 hover:bg-yellow-600 px-3 py-1 text-sm text-white transition-all duration-300 disabled:cursor-not-allowed"
                onClick={() => {
                  const lat = result.lat;
                  const lon = result.lon;

                  // Set selected location
                  setSelectedLocation({
                    name: result.name,
                    display_name: result.display_name,
                    lat,
                    lon,
                    id: result.osm_id,
                  });

                  // Update search params in URL
                  setSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    lat,
                    lon,
                  });

                  // Close modal
                  setOpenModal(false);
                  setSearchName("");
                }}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResult;
