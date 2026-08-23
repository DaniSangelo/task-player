import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

const Banner = () => {
  return (
    <section className="flex items-center justify-between w-full">
      <div className="space-y-0.5">
        <div className="space-y-2">
          {/* todo: add dynamic data */}
          <p>Domingo, 23 de Agosto</p> 
          <h2 className="text-5xl italic">Mysterious thing, time</h2>
        </div>
        <p className="flex justify-end text-sm italic">Albus Dumbledore</p>
      </div>
      <div className="">
        <Button className="rounded-3xl text-white hover:translate-y-0.5">
          <PlusIcon className="text-white" />
          Nova tarefa
        </Button>
      </div>
    </section>
  );
};

export default Banner;
