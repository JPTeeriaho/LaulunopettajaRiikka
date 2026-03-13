import { defineCollection, z } from "astro:content";

const blogDateSchema = z.union([z.string(), z.date()]).transform((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: blogDateSchema,
    excerpt: z.string(),
    image: z.string(),
    lang: z.enum(["fi", "en"]),
    order: z.number().optional(),
  }),
});

const testimonials = defineCollection({
  type: "content",
  schema: z.object({
    author: z.string(),
    role: z.string().optional(),
    lang: z.enum(["fi", "en"]),
    type: z.enum(["long", "impro"]),
    order: z.number(),
  }),
});

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    image: z.string(),
    lang: z.enum(["fi", "en"]),
    order: z.number(),
  }),
});

export const collections = { blog, testimonials, services };
