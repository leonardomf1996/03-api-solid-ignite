import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUseCase } from '../register';

/* 
Factory pattern: resumindo, serve para instanciação de classes, a fim de não ficar
	havendo repetição de código em todos os locais que utilizam o caso de uso
	específico
*/
export function makeRegisterUseCase() {
	const usersRepository = new PrismaUsersRepository();
	const registerUseCase = new RegisterUseCase(usersRepository);
	return registerUseCase;
}