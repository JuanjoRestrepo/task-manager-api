import 'dotenv/config';
import { prisma } from '../persistence/prisma';
import { userRepository } from '../persistence/repositories/user.repository';
import { taskRepository } from '../persistence/repositories/task.repository';

async function main() {
  // 1. Crear usuario
  const user = await userRepository.create({
    name: 'Test User',
    email: 'test@test.com',
    password: '123456',
  });

  console.log('User created:', user);

  // 2. Crear tarea
  const task = await taskRepository.create({
    title: 'Test task',
    description: 'Testing persistence',
    user: { connect: { id: user.id } },
  });

  console.log('Task created:', task);

  // 3. Obtener tareas del usuario
  const tasks = await taskRepository.findAllByUser(user.id);
  console.log('Tasks found:', tasks);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
