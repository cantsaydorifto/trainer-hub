import { TRPCError } from "@trpc/server";
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

  getTeam: protectedProcedure.query(async ({ ctx }) => {
    const team = await ctx.prisma.team.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        pokemonId: true,
        name: true,
        type: true,
      },
    });
    let teamSpacesLeft = team.length;
    while (teamSpacesLeft < 6) {
      team.push({
        name: "",
        pokemonId: 0,
        type: "",
      });
      teamSpacesLeft = teamSpacesLeft + 1;
    }
    return team;
  }),

  addToTeam: protectedProcedure
    .input(
      z.object({
        pokemonId: z.number().lte(905).gte(1),
        name: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (team.length > 6) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Team is full",
        });
      }
      await ctx.prisma.team.create({
        data: {
          pokemonId: input.pokemonId,
          name: input.name,
          type: input.type,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  removeFromTeam: protectedProcedure
    .input(z.number().lte(905).gte(1))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (team.length < 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Team is empty",
        });
      }
      await ctx.prisma.team.delete({
        where: {
          userId_pokemonId: {
            pokemonId: input,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
