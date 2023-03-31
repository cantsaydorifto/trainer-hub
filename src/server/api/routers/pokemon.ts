import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const pokemonRouter = createTRPCRouter({
  catch: protectedProcedure
    .input(z.number().lte(905).gte(1))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          caughtPokemon: {
            create: {
              pokemonId: input,
            },
          },
        },
      });
    }),

  release: protectedProcedure
    .input(z.number().lte(905).gte(1))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          caughtPokemon: {
            delete: {
              userId_pokemonId: {
                pokemonId: input,
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.caughtPokemon.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        pokemonId: true,
      },
    });
    const caughtPokemon = res.map((el) => el.pokemonId);
    return caughtPokemon;
  }),
});
