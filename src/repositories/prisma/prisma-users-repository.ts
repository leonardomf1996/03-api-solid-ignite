import { prisma } from '@/lib/prisma';
import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
	
	async findById(id: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: {
				id
			}
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: {
				email
			}
		});
	}

	async create({ email, name, password_hash }: Prisma.UserCreateInput) {
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password_hash,
			}
		});
      
		return user;
	}
}