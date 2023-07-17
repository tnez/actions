import * as z from "zod";

export const User = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
});

export type User = z.infer<typeof User>;
