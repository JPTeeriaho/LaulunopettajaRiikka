import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.string(),
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
