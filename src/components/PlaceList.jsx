function PlaceList({ places }) {
  return (
    <div className="space-y-4">
      {places.map((place) => {
        const { fsq_place_id, name, location, categories } = place;

        // Use the first category icon (if available)
        const icon =
          categories?.[0]?.icon &&
          `${categories[0].icon.prefix}bg_64${categories[0].icon.suffix}`;

        return (
          <div
            key={fsq_place_id}
            className="flex items-start gap-4 p-4 border rounded-lg shadow-sm dark:border-gray-700 bg-white dark:bg-slate-800"
          >
            {icon && (
              <img
                src={icon}
                alt={`${categories[0].name} icon`}
                className="w-10 h-10"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold text-stone-800 dark:text-slate-200">
                {name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {location.formatted_address}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PlaceList;
