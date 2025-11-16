"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MonsterDisplayProps {
  monsterImage: string | null;
  isTransforming: boolean;
}

export default function MonsterDisplay({
  monsterImage,
  isTransforming,
}: MonsterDisplayProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 min-h-[400px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isTransforming ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-4 border-4 border-pink-500 border-b-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Summoning Your Monster...
            </h3>
            <p className="text-gray-400">
              Transforming your image with dark magic
            </p>
          </motion.div>
        ) : monsterImage ? (
          <motion.div
            key="monster"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <h3 className="text-lg font-semibold mb-3">Your Monster</h3>
            <motion.img
              src={monsterImage}
              alt="Monster"
              className="w-full rounded-lg shadow-2xl"
              initial={{ filter: "brightness(0)" }}
              animate={{ filter: "brightness(1)" }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <a
                href={monsterImage}
                download="monster.png"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
              >
                Download Monster Image
              </a>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500"
          >
            <p className="text-lg">Your monster will appear here...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
