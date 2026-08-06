import { Baby, BookOpen, GraduationCap, Clock } from "lucide-react";

const programs = [
  {
    title: "Creche",
    description:
      "A safe and caring environment where young children receive attention, care, and early development support.",
    icon: Baby,
  },

  {
    title: "Nursery",
    description:
      "Building strong foundations through early learning, creativity, confidence, and discovery.",
    icon: BookOpen,
  },

  {
    title: "Primary",
    description:
      "Providing quality education that develops academic excellence, character, and essential life skills.",
    icon: GraduationCap,
  },

  {
    title: "After School Care",
    description:
      "A supportive program designed to provide care, supervision, and meaningful activities after school hours.",
    icon: Clock,
  },
];


export default function Programs() {
  return (
    <section
      id="academics"
      className="py-20 bg-gray-50"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold text-green-800">
            Our Academic Programs
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            We provide age-appropriate learning programs designed to help
            every child explore, develop, and excel.
          </p>

        </div>



        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">


          {programs.map((program) => {

            const Icon = program.icon;

            return (

              <div
                key={program.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition border border-gray-100"
              >

                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6">

                  <Icon 
                    size={35}
                    className="text-green-700"
                  />

                </div>


                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {program.title}
                </h3>


                <p className="text-gray-600 leading-relaxed">
                  {program.description}
                </p>


              </div>

            );

          })}


        </div>


      </div>

    </section>
  );
}