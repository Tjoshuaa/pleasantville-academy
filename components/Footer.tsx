export default function Footer() {

  return (

    <footer className="bg-green-900 text-white py-10">

      <div className="max-w-7xl mx-auto px-6 text-center">


        <h2 className="text-2xl font-bold">
          Pleasantville Academy
        </h2>


        <p className="mt-3 text-green-100">
          Grooming With Love & God Fearing Approach.
        </p>


        <div className="border-t border-green-700 mt-8 pt-6 text-sm text-green-200">

          © {new Date().getFullYear()} Pleasantville Academy.
          All Rights Reserved.

        </div>


      </div>

    </footer>

  );

}