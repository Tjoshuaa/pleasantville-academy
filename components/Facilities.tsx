import {
  Building2,
  Baby,
  BookOpen,
  Monitor,
  ShieldCheck,
} from "lucide-react";


const facilities = [
  {
    title: "Daycare Area",
    description:
      "The colourful and small classroom size provides an exciting environment for learning and opportunity for close personal interaction between teachers and pupils.",
    icon: Baby,
  },

  {
    title: "Nursery Area",
    description:
      "The cosy, bright, safe, welcoming and stimulating classrooms equipped with whiteboards provide a caring, fun and stimulating environment to meet the individual needs of your child.",
    icon: Building2,
  },

  {
    title: "Classrooms & Specialist Rooms",
    description:
      "Pleasantville Academy offers first class facilities in a secure and attractive building with classrooms and specialist rooms conducive for an effective teaching and learning process.",
    icon: BookOpen,
  },

  {
    title: "Creative Learning Environment",
    description:
      "Our learning spaces provide opportunities to develop children's imaginative play, creativity, confidence, and essential life skills.",
    icon: Monitor,
  },

  {
    title: "Safe & Secure School",
    description:
      "We provide a secure and welcoming environment where children can learn, grow, and develop comfortably under proper guidance and care.",
    icon: ShieldCheck,
  },
];


export default function Facilities() {

  return (

    <section
      id="facilities"
      className="py-20 bg-gray-50"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold text-green-800">
            Our Facilities
          </h2>


          <p className="mt-5 max-w-4xl mx-auto text-gray-600 leading-relaxed">

            Pleasantville Academy offers first class facilities in a secure
            and attractive building with all classrooms and specialist rooms
            conducive for an effective teaching and learning process.

          </p>

        </div>



        {/* Facility Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">


          {facilities.map((facility) => {

            const Icon = facility.icon;


            return (

              <div
                key={facility.title}
                className="group p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition duration-300"
              >


                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5 group-hover:bg-orange-500 transition">

                  <Icon
                    size={35}
                    className="text-green-700 group-hover:text-white transition"
                  />

                </div>



                <h3 className="text-xl font-bold text-green-800 mb-3">

                  {facility.title}

                </h3>



                <p className="text-gray-600 leading-relaxed">

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