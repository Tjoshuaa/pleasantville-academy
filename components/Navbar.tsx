"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";


const links = [
  {
    name: "Home",
    href: "#home",
  },
  {
    name: "About",
    href: "#about",
  },
  {
    name: "Academics",
    href: "#academics",
  },
  {
    name: "Facilities",
    href: "#facilities",
  },
  {
    name: "Gallery",
    href: "#gallery",
  },
  {
    name: "Admissions",
    href: "#admissions",
  },
  {
    name: "Contact",
    href: "#contact",
  },
];


export default function Navbar() {

  const [open, setOpen] = useState(false);


  return (

    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">


      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">


        {/* Logo Area */}

        <a
          href="#home"
          className="flex items-center gap-3"
        >

          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-700">

            <img
              src="/logo.png"
              alt="Pleasantville Academy Logo"
              className="w-full h-full object-contain"
            />

          </div>



          <div>

            <h1 className="font-bold text-green-800 text-lg leading-tight">
              Pleasantville Academy
            </h1>


            <p className="text-xs text-gray-500">
              Grooming With Love & God Fearing Approach
            </p>


          </div>


        </a>





        {/* Desktop Menu */}

        <div className="hidden lg:flex items-center gap-7">

          {links.map((link)=>(

            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 font-medium hover:text-green-700 transition"
            >

              {link.name}

            </a>

          ))}


        </div>





        {/* Mobile Button */}

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-green-800"
        >

          {open ? (
            <X size={30}/>
          ) : (
            <Menu size={30}/>
          )}

        </button>


      </div>





      {/* Mobile Menu */}

      {open && (

        <div className="lg:hidden bg-white border-t shadow-lg px-6 py-6">


          {links.map((link)=>(

            <a
              key={link.name}
              href={link.href}
              onClick={()=>setOpen(false)}
              className="block py-3 text-gray-700 font-medium hover:text-green-700"
            >

              {link.name}

            </a>

          ))}


        </div>

      )}


    </nav>

  );

}