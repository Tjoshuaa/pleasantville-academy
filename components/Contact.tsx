import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";


export default function Contact() {

  return (

    <section
      id="contact"
      className="py-20 bg-white"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold text-green-800">
            Contact Us
          </h2>


          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Make your children's life special by enrolling them at
            Pleasantville Academy.
            Contact us today and begin your child's learning journey.
          </p>

        </div>



        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8">


          {/* Address */}
          <div className="bg-green-50 rounded-2xl p-8">

            <MapPin
              size={40}
              className="text-green-700 mb-5"
            />

            <h3 className="text-xl font-bold text-green-800 mb-3">
              Visit Us
            </h3>


            <p className="text-gray-600 leading-relaxed">
              Pleasantville Academy
              <br />
              207 Bonny Street,
              <br />
              Town Port Harcourt,
              <br />
              Rivers State, Nigeria.
            </p>

          </div>




          {/* Phone */}
          <div className="bg-orange-50 rounded-2xl p-8">

            <Phone
              size={40}
              className="text-orange-600 mb-5"
            />

            <h3 className="text-xl font-bold text-orange-700 mb-3">
              Call Us
            </h3>


            <a
              href="tel:+2348033153911"
              className="text-gray-600 hover:text-green-700"
            >
              +234 803 315 3911
            </a>

          </div>





          {/* Email */}
          <div className="bg-gray-50 rounded-2xl p-8">

            <Mail
              size={40}
              className="text-green-700 mb-5"
            />

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Email Us
            </h3>


            <a
              href="mailto:pleasantvilleacademy@gmail.com"
              className="text-gray-600 hover:text-green-700"
            >
              pleasantvilleacademy@gmail.com
            </a>

          </div>


        </div>




        {/* WhatsApp Button */}
        <div className="text-center mt-12">

          <a
  href="https://wa.me/2348033153911?text=Hello%20Pleasantville%20Academy,%20I%20would%20like%20to%20make%20an%20enquiry%20about%20admission."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-3 bg-green-700 text-white px-8 py-4 rounded-full font-bold hover:bg-green-800 transition"
>

            <MessageCircle size={24}/>

            Chat On WhatsApp

          </a>

        </div>


      </div>


    </section>

  );

}