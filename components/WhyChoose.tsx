import { Brain, Smile, Users } from "lucide-react";

const reasons = [
  {
    title: "Growth Mindset",
    description:
      "At Pleasantville Academy, we are convinced that brains are malleable, and IQ is not fixed yet. We encourage every child to develop confidence, curiosity, and a love for learning.",
    icon: Brain,
  },

  {
    title: "Happiness Matters",
    description:
      "We believe young people can achieve more when they are happy, supported, and well guided in their learning journey.",
    icon: Smile,
  },

  {
    title: "Excellent Teachers",
    description:
      "All teachers are carefully selected and trained to maintain high standards and provide quality learning experiences.",
    icon: Users,
  },
];


export default function WhyChoose() {
  return (
    <section className="py-20 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold text-green-800">
            Why Attend Pleasantville Academy?
          </h2>

          <p className="mt-4 text-gray-600">
            We provide an environment where children can grow,
            learn, and achieve their full potential.
          </p>

        </div>


        <div className="grid md:grid-cols-3 gap-8">

          {reasons.map((reason) => {

            const Icon = reason.icon;

            return (

              <div
                key={reason.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition"
              >

                <Icon
                  size={45}
                  className="text-orange-500 mb-5"
                />

                <h3 className="text-xl font-bold text-green-800 mb-3">
                  {reason.title}
                </h3>


                <p className="text-gray-600 leading-relaxed">
                  {reason.description}
                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}