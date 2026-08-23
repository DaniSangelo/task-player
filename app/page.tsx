import Banner from "./_components/Banner";
import Header from "./_components/Header";
import { DataTable } from "./_components/ui/data-table";
import { tasksTableColumns } from "./_components/table-columns";
import { getTasks } from "./_data-access/tasks/get-tasks";

export default async function Home() {
  const tasks = await getTasks()
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center justify-between py-16 px-16 bg-white sm:items-start border border-accent-400">
        <Header />
        <Banner />
        <DataTable columns={tasksTableColumns} data={tasks} />
      </main>
    </div>
  );
}
