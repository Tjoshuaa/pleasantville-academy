"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Academics", href: "#academics" },
  { name: "Facilities", href: "#facilities" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-green-700 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Pleasantville Academy Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="leading-tight">
            <h1 className="font-bold text-green-800 text-lg">
              Pleasantville Academy
            </h1>
            <p className="text-xs text-gray-600">
              Grooming With Love & God Fearing Approach
            </p>
          </div>
        </a>


        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 font-medium hover:text-green-700 transition"
            >
              {link.name}
            </a>
          ))}

          <a
            href="#admissions"
            className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
          >
            Apply Now
          </a>

        </div>


        {/* Mobile Button */}
        <button
          className="md:hidden text-green-800"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>

      </nav>


      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 py-5">

          <div className="flex flex-col gap-5">

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-gray-700 font-medium"
              >
                {link.name}
              </a>
            ))}


            <a
              href="#admissions"
              className="bg-orange-500 text-white text-center px-5 py-3 rounded-full font-semibold"
            >
              Apply Now
            </a>

          </div>

        </div>
      )}

    </header>
  );
}