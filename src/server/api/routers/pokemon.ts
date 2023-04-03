import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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

  getBadges: protectedProcedure.query(async ({ ctx }) => {
    const badges = await ctx.prisma.trainerBadges.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        badgeId: true,
      },
    });
    return badges.map((el) => el.badgeId);
  }),

  addBadges: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          trainerBadges: {
            create: {
              badgeId: input,
            },
          },
        },
      });
    }),

  checkUsernameAvailability: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input,
        },
      });
      if (user) {
        return false;
      }
      return true;
    }),

  addUserInfo: publicProcedure
    .input(
      z.object({
        username: z.string(),
        starter: z.number(),
        avatar: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session?.user.id,
        },
        data: {
          avatar: input.avatar,
          username: input.username,
          caughtPokemon: {
            create: {
              pokemonId: input.starter,
            },
          },
        },
      });
    }),

  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        username: true,
        avatar: true,
        caughtPokemon: {
          select: {
            pokemonId: true,
          },
        },
        trainerBadges: true,
        team: {
          select: {
            pokemonId: true,
            name: true,
            type: true,
          },
        },
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    const username = user.username || "NO_USERNAME_YET";
    const avatar = user.avatar || 0;
    const userPokemon = user.caughtPokemon.map((el) => el.pokemonId);
    const userBadges = user.trainerBadges.map((el) => el.badgeId);
    const level =
      Math.floor(user.caughtPokemon.length / 2) + user.trainerBadges.length;
    const team = [...user.team];
    let teamSpacesLeft = user.team.length;
    while (teamSpacesLeft < 6) {
      team.push({
        name: "",
        pokemonId: 0,
        type: "",
      });
      teamSpacesLeft = teamSpacesLeft + 1;
    }

    const userInfo = {
      username,
      avatar,
      caughtPokemon: userPokemon,
      trainerBadges: userBadges,
      team,
      level,
    };

    return userInfo;
  }),
});
