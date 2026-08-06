"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-orange-600" />

      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-black/20" />


      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500 p-5 rounded-full shadow-lg">
              <GraduationCap size={50} />
            </div>
          </div>


          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Welcome to

            <span className="block text-orange-300">
              Pleasantville Academy
            </span>

          </h1>


          {/* Motto */}
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-100">
            Grooming With Love & God Fearing Approach.
          </p>


          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-gray-200">
            We nurture young minds through quality education,
            character development, discipline, and excellence.
          </p>



          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">

            <a
              href="#admissions"
              className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              Apply Now
              <ArrowRight size={20} />
            </a>


            <a
              href="#contact"
              className="border-2 border-white hover:bg-white hover:text-green-800 transition px-8 py-4 rounded-full font-semibold"
            >
              Contact Us
            </a>

          </div>


        </motion.div>

      </div>


      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white rounded-t-[50%]" />

    </section>
  );
}