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

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We would love to welcome you to Pleasantville Academy.
            Reach out to us and begin your child's learning journey.
          </p>

        </div>



        <div className="grid md:grid-cols-3 gap-8">


          {/* Address */}
          <div className="bg-green-50 p-8 rounded-2xl">

            <MapPin
              size={40}
              className="text-green-700 mb-5"
            />

            <h3 className="font-bold text-xl text-gray-800 mb-3">
              Visit Us
            </h3>

            <p className="text-gray-600">
              Pleasantville Academy,
              <br />
              Port Harcourt, Rivers State,
              Nigeria.
            </p>

          </div>




          {/* Phone */}
          <div className="bg-orange-50 p-8 rounded-2xl">

            <Phone
              size={40}
              className="text-orange-600 mb-5"
            />

            <h3 className="font-bold text-xl text-gray-800 mb-3">
              Call Us
            </h3>

            <p className="text-gray-600">
              Contact the school office for enquiries,
              admissions, and visits.
            </p>

          </div>





          {/* Email */}
          <div className="bg-gray-50 p-8 rounded-2xl">

            <Mail
              size={40}
              className="text-green-700 mb-5"
            />

            <h3 className="font-bold text-xl text-gray-800 mb-3">
              Email Us
            </h3>

            <p className="text-gray-600">
              pleasantvilleacademy@gmail.com
            </p>

          </div>


        </div>



        {/* WhatsApp Button */}
        <div className="text-center mt-12">

          <a
            href="#"
            className="inline-flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full font-bold transition"
          >

            <MessageCircle size={24}/>

            Chat With Us

          </a>

        </div>


      </div>

    </section>

  );
}