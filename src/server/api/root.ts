import { createTRPCRouter } from "~/server/api/trpc";
import { pokemonRouter } from "./routers/pokemon";
import { postRouter } from "./routers/posts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pokemon: pokemonRouter,
  posts: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
