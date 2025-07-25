import { format } from "date-fns";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface Location {
  address: string;
  locality: string;
  region: string;
  postcode: string;
  admin_region: string;
  post_town: string;
  po_box: string;
  country: string;
  formatted_address: string;
}

interface CategoryIcon {
  id: string;
  created_at: string; // or `Date` if parsed
  prefix: string;
  suffix: string;
  width: number;
  height: number;
  classifications: string[];
}

interface Category {
  fsq_category_id: string;
  name: string;
  short_name: string;
  plural_name: string;
  icon: CategoryIcon;
}

interface LocationSummary {
  fsq_place_id: string;
  name: string;
  location: Location;
  categories: Category[];
}

interface WeatherSummary {
  datetime: string;
  conditions: string;
  description: string;
  cloudcover: number;
  windspeed: number;
  humidity: number;
  tempmin: number;
  tempmax: number;
  feelslike: number;
  precipprob: number;
  sunrise: string;
  sunset: string;
}

interface PlanRequestParams {
  days: number;
  purpose: string;
  destination: string;
  weatherDescription: string;
}

interface TripPlannerContextType {
  result: string;
  setResult: Dispatch<SetStateAction<string>>;
  data: LocationSummary | null;
  setData: Dispatch<SetStateAction<LocationSummary | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  weather: WeatherSummary[];
  setWeather: Dispatch<SetStateAction<WeatherSummary[]>>;
  isOpen: boolean;
  isOpenWeather: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsOpenWeather: Dispatch<SetStateAction<boolean>>;
  handlePlanRequest: (params: PlanRequestParams) => Promise<void>;
  fetchWeather: (
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  fetchPlaces: (lat: number, lon: number) => Promise<void>;
}

const TripPlannerContext = createContext<TripPlannerContextType | null>(null);

export const TripPlannerProvider = ({ children }) => {
  const [result, setResult] = useState("");
  const [data, setData] = useState<LocationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherSummary[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenWeather, setIsOpenWeather] = useState(false);

  const handlePlanRequest = async ({
    days,
    purpose,
    destination,
    weatherDescription,
  }: PlanRequestParams) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/qna/ask?days=${days}&purpose=${encodeURIComponent(
          purpose
        )}&destination=${encodeURIComponent(
          destination
        )}&weather=${encodeURIComponent(weatherDescription)}`
      );
      const parsed = await res.json();
      const content = parsed.choices?.[0]?.message?.content || "No response.";

      setResult(content);
      console.log({ days, purpose, destination, weatherDescription });
    } catch (err) {
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async (latValue: number, lonValue: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/places?lat=${latValue}&lon=${lonValue}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setData(data.results);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const fetchWeather = async (
    latValue: number,
    lonValue: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/weather?lat=${latValue}&lon=${lonValue}&start=${format(
          startDate,
          "yyyy-MM-dd"
        )}&end=${format(endDate, "yyyy-MM-dd")}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setWeather(data.days);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  return (
    <TripPlannerContext.Provider
      value={{
        result,
        setResult,
        data,
        setData,
        loading,
        setLoading,
        weather,
        setWeather,
        isOpen,
        setIsOpen,
        isOpenWeather,
        setIsOpenWeather,
        handlePlanRequest,
        fetchWeather,
        fetchPlaces,
      }}
    >
      {children}
    </TripPlannerContext.Provider>
  );
};

export const useTripPlanner = () => {
  const context = useContext(TripPlannerContext);
  if (!context) {
    throw new Error("useTripPlanner must be used within a TripPlannerProvider");
  }
  return context;
};
