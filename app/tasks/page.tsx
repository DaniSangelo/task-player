import { Circle } from "lucide-react";
import { getTasks } from "../_data-access/tasks/get-tasks";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import AddTaskButton from "../_components/add-task.button";

export default async function Task() {
  const tasks = await getTasks();
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white">
      <main className="flex w-full min-w-0 max-w-7xl flex-1 flex-col items-center justify-between space-y-10 px-4 py-10 sm:items-star sm:px-16 sm:py-16">
        <div className="flex w-full min-w-0 flex-col space-y-5">
          <div className="w-full md:ml-auto md:w-auto">
            <AddTaskButton />
          </div>
          <div className="w-full min-w-0 overflow-hidden rounded-md border border-accent-100/50">
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
