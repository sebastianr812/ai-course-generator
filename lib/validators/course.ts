import * as z from 'zod';

export const CreateChaptersValidator = z.object({
    title: z.string().min(3).max(100),
    units: z.array(z.string())
});

export type CreateChaptersRequest = z.infer<typeof CreateChaptersValidator>;