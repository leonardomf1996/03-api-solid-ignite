import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		const authenticateUseCase = makeAuthenticateUseCase();

		const { user } = await authenticateUseCase.execute({ email, password });

		const token = await reply.jwtSign(
			{
				rule: user.role
			},
			{
				sign: {
					sub: user.id,
					expiresIn: '7d'
				}
			});

		const refreshToken = await reply.jwtSign(
			{
				rule: user.role
			},
			{
				sign: {
					sub: user.id
				}
			});

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',			// Rotas que o refreshToken pode ser utilizado
				secure: true,		// Para add segurança ao token e não deixar que o front o acesse da forma que quiser
				sameSite: true,	// Cookie só vai ter acesso no mesmo domínio
				httpOnly: true,	// Cookie só pode ser visto no back end
			})
			.status(200)
			.send({ token });

	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: error.message });
		}

		throw error;
	}

}