import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TaskStatus } from "../app/generated/prisma/client";

const userId = "ec155878-b946-461f-ab8c-fcef68453775";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const taskId = (index: number) =>
  `7e6f0f52-2a41-4d25-bf5c-71bd3f7dd${index.toString().padStart(3, "0")}`;

const historyId = (index: number) =>
  `8f7f1f63-3b52-4e36-c06d-82ce4e8ee${index.toString().padStart(3, "0")}`;

const taskTitles = [
  "Planejar a semana",
  "Revisar documentação do projeto",
  "Implementar tela de tarefas",
  "Validar fluxo de criação",
  "Preparar revisão do código",
  "Configurar ambiente local",
  "Criar dados de teste",
  "Revisar consultas ao banco",
  "Adicionar tratamento de erros",
  "Testar responsividade",
  "Organizar componentes",
  "Documentar decisões técnicas",
  "Verificar permissões de acesso",
  "Ajustar mensagens da interface",
  "Executar revisão final",
  "Mapear regras de negócio",
  "Revisar fluxo de autenticação",
  "Criar estados de carregamento",
  "Atualizar dependências",
  "Conferir variáveis de ambiente",
  "Avaliar desempenho da listagem",
  "Refatorar acesso ao banco",
  "Criar cenário de paginação",
  "Testar filtros por status",
  "Revisar acessibilidade",
  "Ajustar layout mobile",
  "Preparar dados para homologação",
  "Validar mensagens de erro",
  "Revisar componentes de formulário",
  "Investigar logs da aplicação",
  "Criar checklist de entrega",
  "Atualizar guia de instalação",
  "Revisar estratégia de cache",
  "Testar ações do servidor",
  "Conferir consultas de tempo",
  "Preparar demonstração",
];

const statuses = [
  TaskStatus.DONE,
  TaskStatus.PAUSED,
  TaskStatus.PENDING,
];

const atMonthTime = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
) => {
  return new Date(year, month, day, hour, minute, 0, 0);
};

type ProgressSeed = {
  id: string;
  task_id: string;
  time_spent_seconds: number;
  started_at: Date | null;
  finished_at: Date | null;
};

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error(`User ${userId} was not found`);
  }

  const now = new Date();
  const seedYear = now.getFullYear();

  const tasks = taskTitles.map((title, index) => {
    const number = index + 1;
    const status =
      number === 1 ? TaskStatus.RUNNING : statuses[index % statuses.length];
    const month = Math.floor(index / 3);
    const createdAt = atMonthTime(
      seedYear,
      month,
      3 + (number % 20),
      (number * 2) % 24,
      (number * 7) % 60,
    );
    const updatedAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);

    return {
      id: taskId(number),
      title,
      description: `Descrição de teste para a tarefa ${number}, usada nos cenários da aplicação.`,
      status,
      created_at: number === 1 ? now : createdAt,
      updated_at: number === 1 ? now : updatedAt,
      user_id: userId,
    };
  });

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      create: task,
      update: {
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
      },
    });
  }

  // Pending tasks get a zero baseline; running tasks get an open session.
  const progressHistory: ProgressSeed[] = tasks
    .flatMap((task, index): ProgressSeed[] => {
      if (task.status === TaskStatus.PENDING) {
        return [{
          id: historyId(500 + index + 1),
          task_id: task.id,
          time_spent_seconds: 0,
          started_at: null,
          finished_at: null,
        }];
      }

      if (task.status === TaskStatus.RUNNING) {
        const startedAt = new Date(now.getTime() - 45 * 60 * 1000);
        return [{
          id: historyId(500 + index + 1),
          task_id: task.id,
          time_spent_seconds: 0,
          started_at: startedAt,
          finished_at: null,
        }];
      }

      return [0, 1].map((session) => {
        const taskNumber = index + 1;
        const taskMonth = task.created_at!.getMonth();

        const startedAt = atMonthTime(
          seedYear,
          taskMonth,
          8 + session * 8 + (taskNumber % 5),
          9 + ((taskNumber + session) % 6),
          session === 0 ? 15 : 30,
        );
        const durationSeconds = (taskNumber + session + 2) * 900;

        return {
          id: historyId(taskNumber * 10 + session + 1),
          task_id: task.id,
          time_spent_seconds: durationSeconds,
          started_at: startedAt,
          finished_at: new Date(startedAt.getTime() + durationSeconds * 1000),
        };
      });
    });

  await prisma.taskProgressHistory.deleteMany({
    where: { task_id: { in: tasks.map((task) => task.id) } },
  });

  await prisma.taskProgressHistory.createMany({
    data: progressHistory.map((progress) => ({
      ...progress,
      created_at: progress.finished_at ?? now,
      updated_at: progress.finished_at ?? now,
    })),
  });

  console.log(
    `${tasks.length} task(s) and ${progressHistory.length} progress record(s) seeded for user ${userId}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
