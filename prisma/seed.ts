import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TaskStatus } from "../app/generated/prisma/client";

const userId = "591f1101-7fc0-42d6-babf-5dfc2fc4a605";
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
  TaskStatus.RUNNING,
  TaskStatus.PAUSED,
  TaskStatus.DONE,
  TaskStatus.PENDING,
  TaskStatus.PAUSED,
  TaskStatus.DONE,
  TaskStatus.PENDING,
  TaskStatus.DONE,
];

const daysAgo = (reference: Date, days: number) => {
  const date = new Date(reference);
  date.setDate(date.getDate() - days);
  return date;
};

const atTime = (
  reference: Date,
  daysAgoValue: number,
  hour: number,
  minute: number,
) => {
  const date = daysAgo(reference, daysAgoValue);
  date.setHours(hour, minute, 0, 0);
  return date;
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
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const tasks = taskTitles.map((title, index) => {
    const number = index + 1;
    const status =
      number === 1 ? TaskStatus.RUNNING : statuses[index % statuses.length];
    const createdAt = atTime(
      now,
      number % 20,
      (number * 2) % 24,
      (number * 7) % 60,
    );

    return {
      id: taskId(number),
      title,
      description: `Descrição de teste para a tarefa ${number}, usada nos cenários da aplicação.`,
      status,
      created_at: createdAt,
      updated_at: now,
      started_at:
        status === TaskStatus.RUNNING
          ? new Date(now.getTime() - 45 * 60 * 1000)
          : null,
      finished_at:
        status === TaskStatus.DONE ? atTime(now, number % 6, 17, 30) : null,
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
        started_at: task.started_at,
        finished_at: task.finished_at,
      },
    });
  }

  const progressHistory = [
    {
      id: historyId(1),
      task_id: taskId(1),
      time_spent_seconds: 3600,
      started_at: atTime(now, 1, 14, 0),
      finished_at: atTime(now, 1, 15, 0),
    },
    {
      id: historyId(2),
      task_id: taskId(2),
      time_spent_seconds: 7200,
      started_at: atTime(now, 0, 8, 0),
      finished_at: atTime(now, 0, 10, 0),
    },
    {
      id: historyId(3),
      task_id: taskId(3),
      time_spent_seconds: 2700,
      started_at: atTime(now, 0, 10, 30),
      finished_at: atTime(now, 0, 11, 15),
    },
    {
      id: historyId(4),
      task_id: taskId(4),
      time_spent_seconds: 5400,
      started_at: new Date(startOfToday.getTime() - 30 * 60 * 1000),
      finished_at: new Date(startOfToday.getTime() + 60 * 60 * 1000),
    },
    ...Array.from({ length: 12 }, (_, index) => {
      const startedAt = atTime(now, (index % 7) + 1, 9 + (index % 4), 15);
      const durationSeconds = (index + 1) * 900;

      return {
        id: historyId(index + 5),
        task_id: taskId(index + 5),
        time_spent_seconds: durationSeconds,
        started_at: startedAt,
        finished_at: new Date(startedAt.getTime() + durationSeconds * 1000),
      };
    }),
  ];

  await prisma.taskProgressHistory.createMany({
    data: progressHistory.map((progress) => ({
      ...progress,
      created_at: progress.finished_at,
      updated_at: progress.finished_at,
    })),
    skipDuplicates: true,
  });

  for (const progress of progressHistory) {
    await prisma.$executeRaw`
      UPDATE tasks
      SET time_spent = COALESCE(
        (
          SELECT SUM(history.time_spent_seconds) * INTERVAL '1 second'
          FROM task_progress_history AS history
          WHERE history.task_id = ${progress.task_id}::uuid
        ),
        INTERVAL '0 seconds'
      )
      WHERE id = ${progress.task_id}::uuid
        AND user_id = ${userId}::uuid
    `;
  }

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