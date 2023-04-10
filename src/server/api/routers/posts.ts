import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAllPublic: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        select: {
          _count: {
            select: {
              likedBy: true,
            },
          },
          author: {
            select: {
              username: true,
              id: true,
              image: true,
            },
          },
          id: true,
          content: true,
          date: true,
        },
        take: 10,
        skip: (input - 1) * 10,
        orderBy: {
          date: "desc",
        },
      });
      const postCount = await ctx.prisma.post.count();

      return { posts, postCount: postCount };
    }),

  getAll: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const posts = await ctx.prisma.post.findMany({
      select: {
        author: {
          select: {
            username: true,
            id: true,
            image: true,
          },
        },
        id: true,
        content: true,
        date: true,
        likedBy: {
          select: {
            userId: true,
          },
          where: {
            userId: ctx.session.user.id,
          },
        },
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
      take: 10,
      skip: (input - 1) * 10,
      orderBy: {
        date: "desc",
      },
    });
    const postCount = await ctx.prisma.post.count();
    return { posts, postCount: postCount };
  }),

  createPost: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: ctx.session.user.id,
        },
        select: {
          author: {
            select: {
              username: true,
              id: true,
              image: true,
            },
          },
          id: true,
          content: true,
          date: true,
          likedBy: {
            select: {
              userId: true,
            },
            where: {
              userId: ctx.session.user.id,
            },
          },
          _count: {
            select: {
              likedBy: true,
            },
          },
        },
      });
      return res;
    }),

  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        username: true,
        avatar: true,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    const userInfo = {
      avatar: user.avatar ? user.avatar : 0,
      username: user.username ? user.username : "NO_USERNAME_YET",
    };
    return userInfo;
  }),

  likePost: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      const like = await ctx.prisma.likes.findUnique({
        where: {
          userId_postId: {
            postId: input,
            userId: ctx.session.user.id,
          },
        },
      });
      if (like) {
        await ctx.prisma.likes.delete({
          where: {
            userId_postId: {
              postId: input,
              userId: ctx.session.user.id,
            },
          },
        });
      } else {
        await ctx.prisma.likes.create({
          data: {
            postId: input,
            userId: ctx.session.user.id,
          },
        });
      }
    }),
});
