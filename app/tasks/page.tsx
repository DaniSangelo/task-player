import { Circle, PlusIcon } from "lucide-react";
import { getTasks } from "../_data-access/tasks/get-tasks";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "../_components/ui/button";

export default async function Task() {
  const tasks = await getTasks();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center justify-between py-16 px-16 sm:items-star space-y-10">
        <div className="flex flex-col space-y-5">
          <div className="ml-auto">
            <Button className="rounded-3xl  text-white hover:translate-y-0.5 px-5 py-5 items-center">
              <PlusIcon className="text-white" />
              Add task
            </Button>
          </div>
          <div className="border rounded-md border-accent-100/50">
            <div className="flex px-5 py-5 items-center gap-2 border-accent-100/50 border-b mb-10">
              <Circle size={10} className="fill-accent-500 text-accent-500" />
              <p className="text-sm">Today&#39;s tasks</p>
              <p className="text-[10px] text-secondary-500 bg-accent-50 rounded-full py-1 px-2">
                {tasks.length}
              </p>
            </div>
            <DataTable columns={columns} data={tasks} />
          </div>
          <footer className="flex w-full px-2 py-8">
            <div className="flex flex-col items-start ml-auto">
              <p className="tracking-widest font-heading uppercase text-xs font-semibold text-accent-950/50">
                Total time worked
              </p>
              <div className="flex gap-2 items-baseline">
                <p className="text-4xl font-bold text-accent-950">04:06:33</p>
                <p className="text-sm opacity-50">hours</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
