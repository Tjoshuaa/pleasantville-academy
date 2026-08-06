import {
  Search,
  FileText,
  UserCheck,
  GraduationCap,
} from "lucide-react";


const steps = [
  {
    title: "Make an Enquiry",
    description:
      "Contact Pleasantville Academy to learn more about our programs and admission requirements.",
    icon: Search,
  },

  {
    title: "Submit Application",
    description:
      "Complete the admission process and provide the required information for your child.",
    icon: FileText,
  },

  {
    title: "Assessment & Review",
    description:
      "Allow our team to understand your child's learning needs and placement.",
    icon: UserCheck,
  },

  {
    title: "Begin Learning",
    description:
      "Welcome your child into our nurturing and supportive learning environment.",
    icon: GraduationCap,
  },
];


export default function Admissions() {
  return (
    <section
      id="admissions"
      className="py-20 bg-green-800 text-white"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold">
            Admissions
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-green-100">
            Begin your child's journey with Pleasantville Academy.
            We are committed to providing a supportive environment where
            children can explore, evolve, and excel.
          </p>

        </div>



        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8">


          {steps.map((step, index) => {

            const Icon = step.icon;


            return (

              <div
                key={step.title}
                className="bg-white text-gray-800 rounded-2xl p-6 relative"
              >

                <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>


                <div className="mt-5">

                  <Icon
                    size={40}
                    className="text-green-700 mb-4"
                  />


                  <h3 className="font-bold text-lg mb-3">
                    {step.title}
                  </h3>


                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>

                </div>

              </div>

            );

          })}


        </div>



        {/* Button */}
        <div className="text-center mt-12">

          <a
            href="#contact"
            className="inline-block bg-orange-500 hover:bg-orange-600 transition px-10 py-4 rounded-full font-bold"
          >
            Start Admission Process
          </a>

        </div>


      </div>

    </section>
  );
}