import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

const Banner = () => {
  return (
    <section className="flex items-center justify-between w-full">
      <div className="space-y-0.5">
        <div className="space-y-2">
          {/* todo: add dynamic data */}
          <p className="opacity-50">Domingo, 23 de Agosto</p>
          <div className="border-l-3 px-4 space-y-1">
            <h2 className="text-5xl italic">Mysterious thing, time.</h2>
            <p className="italic text-md">
              Powerful, and when meddled with, dangerous
            </p>
          </div>
        </div>
        <p className="flex justify-end text-sm italic opacity-50">
          Albus Dumbledore
        </p>
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
