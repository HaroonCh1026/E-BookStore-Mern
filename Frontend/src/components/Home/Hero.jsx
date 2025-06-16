import React from "react";
import hero from "../../assets/Herobg.png";

const Hero = () => {
  return (
    <div className=" h-screen w-full flex items-center justify-center">
      <div className="h-full lg:h-[90vh] flex flex-col lg:flex-row items-center justify-between bg-zinc-900 px-6 lg:px-20 py-12">
        <div className="sm:mt-32 md:mb-12 w-full lg:w-1/2 flex flex-col justify-center space-y-6 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-yellow-100">
            Discover Your Next Great Read
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-300">
            Uncover captivating stories, enriching knowledge, and endless
            inspiration in our curated collection of books.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button className="text-lg sm:text-xl lg:text-2xl text-yellow-100 font-semibold border border-yellow-100 px-6 sm:px-8 py-2 sm:py-3 hover:bg-yellow-100 hover:text-zinc-900 rounded-full transition duration-300">
              Discover Books
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0 ">
          <img
            src={hero}
            alt="Book Store Illustration"
            className="max-w-xs sm:max-w-md lg:max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
