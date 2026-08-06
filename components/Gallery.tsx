import Image from "next/image";

const galleryImages = [
  {
    title: "Learning Environment",
    image: "/gallery/classroom.jpg",
  },
  {
    title: "School Activities",
    image: "/gallery/activity.jpg",
  },
  {
    title: "Happy Pupils",
    image: "/gallery/students.jpg",
  },
  {
    title: "Campus Life",
    image: "/gallery/campus.jpg",
  },
  {
    title: "Sports Activities",
    image: "/gallery/sports.jpg",
  },
  {
    title: "School Events",
    image: "/gallery/events.jpg",
  },
];


export default function Gallery() {
  return (
    <section
      id="gallery"
      className="py-20 bg-gray-50"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold text-green-800">
            School Gallery
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            A glimpse into learning, creativity, friendships, and memorable
            moments at Pleasantville Academy.
          </p>

        </div>



        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">


          {galleryImages.map((item) => (

            <div
              key={item.title}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition"
            >

              <div className="relative h-72 bg-green-100 flex items-center justify-center">


                {/* Temporary Placeholder */}
                <div className="text-center text-green-800">

                  <p className="font-bold text-lg">
                    {item.title}
                  </p>

                  <p className="text-sm mt-2">
                    Image coming soon
                  </p>

                </div>


              </div>


              <div className="p-5">

                <h3 className="font-bold text-gray-800">
                  {item.title}
                </h3>

              </div>


            </div>

          ))}


        </div>


      </div>

    </section>
  );
}