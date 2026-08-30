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

const tasks = [
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd001",
    title: "Planejar a semana",
    description: "Definir as prioridades e organizar as tarefas da semana.",
    status: TaskStatus.DONE,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd002",
    title: "Revisar documentação do projeto",
    description: "Atualizar a documentação com as decisões mais recentes.",
    status: TaskStatus.PENDING,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd003",
    title: "Implementar tela de tarefas",
    description: "Concluir a listagem e os controles de acompanhamento.",
    status: TaskStatus.RUNNING,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd004",
    title: "Validar fluxo de criação",
    description: "Testar a criação de tarefas com dados válidos e inválidos.",
    status: TaskStatus.PAUSED,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd005",
    title: "Preparar revisão do código",
    description: "Separar os pontos que precisam de revisão antes do merge.",
    status: TaskStatus.PENDING,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd006",
    title: "Configurar ambiente local",
    description: "Garantir que as dependências e variáveis estejam configuradas.",
    status: TaskStatus.DONE,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd007",
    title: "Criar dados de teste",
    description: "Montar cenários representativos para validar a aplicação.",
    status: TaskStatus.DONE,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd008",
    title: "Revisar consultas ao banco",
    description: "Verificar filtros, ordenação e desempenho das consultas.",
    status: TaskStatus.PENDING,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd009",
    title: "Adicionar tratamento de erros",
    description: "Cobrir falhas de conexão e entradas inválidas no fluxo principal.",
    status: TaskStatus.PAUSED,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd010",
    title: "Testar responsividade",
    description: "Validar a interface em tamanhos de tela diferentes.",
    status: TaskStatus.RUNNING,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd011",
    title: "Organizar componentes",
    description: "Revisar a estrutura dos componentes compartilhados.",
    status: TaskStatus.PENDING,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd012",
    title: "Documentar decisões técnicas",
    description: "Registrar as principais escolhas de arquitetura do projeto.",
    status: TaskStatus.DONE,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd013",
    title: "Verificar permissões de acesso",
    description: "Confirmar que cada usuário visualiza apenas suas tarefas.",
    status: TaskStatus.PENDING,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd014",
    title: "Ajustar mensagens da interface",
    description: "Deixar os textos de feedback mais claros e consistentes.",
    status: TaskStatus.PAUSED,
  },
  {
    id: "7e6f0f52-2a41-4d25-bf5c-71bd3f7dd015",
    title: "Executar revisão final",
    description: "Conferir o estado do projeto antes de concluir a entrega.",
    status: TaskStatus.PENDING,
  },
];

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error(`User ${userId} was not found`);
  }

  const result = await prisma.task.createMany({
    data: tasks.map((task) => ({ ...task, user_id: userId })),
    skipDuplicates: true,
  });

  console.log(`${result.count} task(s) seeded for user ${userId}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });