const Banner = () => {
  return (
    <section className="flex items-center justify-center w-full">
      <div className="space-y-0.5">
        <div className="space-y-2">
          <div className="border-l-3 px-4 space-y-1">
            <h2 className="text-lg md:text-5xl italic opacity-90">Mysterious thing, time.</h2>
            <p className="italic md:text-md text-sm">
              Powerful, and when meddled with, dangerous
            </p>
          </div>
        </div>
        <p className="flex justify-end text-xs md:text-sm italic opacity-50">
          Albus Dumbledore
        </p>
      </div>
    </section>
  );
};

export default Banner;
