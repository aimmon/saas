import { defineCollections, defineDocs, frontmatterSchema } from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
})

export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    image: z.string().optional(),
    date: z.coerce.date(),
    published: z.boolean().default(true),
    categories: z.array(z.string()).default([]),
    author: z.string(),
    tags: z.array(z.string()).default([]),
  }),
})

export const authors = defineCollections({
  type: "meta",
  dir: "content/authors",
  schema: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
  }),
})

export const categories = defineCollections({
  type: "meta",
  dir: "content/categories",
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    slug: z.string(),
  }),
})
