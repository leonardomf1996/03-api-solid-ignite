import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
   const createCheckInParamSchema = z.object({
      gymId: z.string().uuid(),
   });

   const createCheckInBodySchema = z.object({
      latitude: z.number().refine(value => {
         return Math.abs(value) <= 90
      }),
      longitude: z.number().refine(value => {
         return Math.abs(value) <= 180
      }),
   });

   const { gymId } = createCheckInParamSchema.parse(request.params);
   const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

   const createCheckInUseCase = makeCheckInUseCase();

   const { checkIn } = await createCheckInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude
   });

   return reply.status(201).send({ checkIn });
}