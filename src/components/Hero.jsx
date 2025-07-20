import { motion } from "framer-motion";

function Hero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-10 px-4"
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        Plan Your Packing with AI
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
        Tell where you're going and for how long — and let it help you pack
        smart.
      </p>
    </motion.header>
  );
}

export default Hero;
