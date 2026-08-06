import { BookOpen, Heart, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="py-20 bg-white"
    >

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold text-green-800">
            About Pleasantville Academy
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Exploring talents, nurturing potential, and building well-rounded
            children for the future.
          </p>

        </div>


        <div className="grid md:grid-cols-2 gap-12 items-center">


          {/* About Text */}
          <div>

            <h3 className="text-2xl font-bold text-gray-800 mb-5">
              Welcome to Pleasantville Academy, Port Harcourt
            </h3>


            <p className="text-gray-600 leading-relaxed mb-5">
              We help your child to explore, evolve and excel at everything
              they do.
            </p>


            <p className="text-gray-600 leading-relaxed mb-5">
              We believe that every child is endowed, and our goal is to lay
              the foundation for the early discovery of those talents.
            </p>


            <p className="text-gray-600 leading-relaxed mb-5">
              We pursue this through building and nurturing the partnership
              between the parent, the school and the child, ensuring each party
              plays their role in building the total child.
            </p>


            <p className="text-gray-600 leading-relaxed">
              Learning should be wholesome and should not just be about head
              knowledge to pass exams, but should embrace life skills that make
              the child a well-rounded adult in their adulthood.
            </p>


          </div>



          {/* Values */}
          <div className="grid gap-5">


            <div className="p-6 rounded-xl bg-green-50 border border-green-100">

              <BookOpen 
                className="text-green-700 mb-3" 
                size={35}
              />

              <h4 className="font-bold text-lg text-green-800">
                Explore
              </h4>

              <p className="text-gray-600 mt-2">
                Helping children discover their abilities, interests, and
                talents from an early stage.
              </p>

            </div>



            <div className="p-6 rounded-xl bg-orange-50 border border-orange-100">

              <Heart 
                className="text-orange-600 mb-3" 
                size={35}
              />

              <h4 className="font-bold text-lg text-orange-700">
                Nurture
              </h4>

              <p className="text-gray-600 mt-2">
                Creating a strong partnership between parents, school, and
                children to develop the total child.
              </p>

            </div>



            <div className="p-6 rounded-xl bg-gray-50 border">

              <ShieldCheck 
                className="text-green-700 mb-3" 
                size={35}
              />

              <h4 className="font-bold text-lg text-gray-800">
                Excel
              </h4>

              <p className="text-gray-600 mt-2">
                Building academic excellence alongside life skills for a
                confident and well-rounded future.
              </p>

            </div>


          </div>


        </div>

      </div>

    </section>
  );
}