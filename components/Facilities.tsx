import {
  Building2,
  BookOpen,
  Monitor,
  Dumbbell,
  Bus,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";


const facilities = [
  {
    title: "Modern Classrooms",
    description:
      "Comfortable learning spaces designed to encourage creativity, participation, and effective learning.",
    icon: Building2,
  },

  {
    title: "Library",
    description:
      "A resourceful reading environment that encourages research, imagination, and a love for learning.",
    icon: BookOpen,
  },

  {
    title: "ICT Lab",
    description:
      "Introducing pupils to technology and digital skills needed for the modern world.",
    icon: Monitor,
  },

  {
    title: "Playground & Sports",
    description:
      "A safe environment where children develop teamwork, confidence, and physical skills.",
    icon: Dumbbell,
  },

  {
    title: "School Transportation",
    description:
      "Reliable transportation support to provide convenience and safety for pupils.",
    icon: Bus,
  },

  {
    title: "Sick Bay",
    description:
      "Providing care and attention to pupils' health and wellbeing while in school.",
    icon: HeartPulse,
  },

  {
    title: "Security",
    description:
      "A secure environment where children can learn, grow, and thrive comfortably.",
    icon: ShieldCheck,
  },
];


export default function Facilities() {
  return (
    <section
      id="facilities"
      className="py-20 bg-white"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold text-green-800">
            Our Facilities
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Providing a supportive environment with facilities that enhance
            learning, creativity, safety, and personal development.
          </p>

        </div>



        {/* Facility Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">


          {facilities.map((facility) => {

            const Icon = facility.icon;


            return (

              <div
                key={facility.title}
                className="group p-7 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-green-800 transition duration-300"
              >

                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-5 group-hover:bg-orange-500 transition">

                  <Icon
                    size={35}
                    className="text-orange-600 group-hover:text-white"
                  />

                </div>


                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white mb-3">
                  {facility.title}
                </h3>


                <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed">
                  {facility.description}
                </p>


              </div>

            );

          })}


        </div>


      </div>

    </section>
  );
}