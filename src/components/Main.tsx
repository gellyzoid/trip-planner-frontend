import { format } from "date-fns";
import { motion } from "framer-motion";
import AIResult from "./AIResult";
import TripPlannerForm from "./TripPlannerForm";
import { useTripPlanner } from "../contexts/TripPlannerContext";

function Main() {
  return (
    <div className="h-screen">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row h-full md:max-w-2/3 mx-auto antialiased text-gray-800 dark:text-gray-100"
      >
        {/* 📝 Form Section */}

        <TripPlannerForm />

        {/* 📋 Result Section */}
        <AIResult />
      </motion.section>
    </div>
  );
}

export default Main;
