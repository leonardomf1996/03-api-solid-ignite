import { FastifyRequest, FastifyReply } from 'fastify';

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
   await request.jwtVerify({ onlyCookie: true })

   const { role } = request.user

   const token = await reply.jwtSign(
      { role },
      {
         sign: {
            sub: request.user.sub,
            expiresIn: '7d'
         }
      });

   const refreshToken = await reply.jwtSign(
      { role },
      {
         sign: {
            sub: request.user.sub
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


}