import { authors, blog, categories } from "fumadocs-mdx:collections/server"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
import { loader } from "fumadocs-core/source"
import { i18n } from "@/shared/lib/i18n"
import type { BlogAuthor, BlogCategory, BlogPost } from "@/shared/types/blog"

export type BlogFrontmatter = {
  title: string
  description?: string
  image?: string
  date: Date
  published: boolean
  categories: string[]
  author: string
  tags: string[]
}

export const blogSource = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blog, []),
  i18n,
})

function getIdFromPath(path: string): string {
  const parts = path.split("/")
  const filename = parts[parts.length - 1]
  return filename.replace(/\.(json|yaml)$/, "")
}

export function getAuthors(): BlogAuthor[] {
  return authors.map((author) => ({
    id: getIdFromPath(author.info.path),
    name: author.name,
    avatar: author.avatar,
    bio: author.bio,
    twitter: author.twitter,
    github: author.github,
    website: author.website,
  }))
}

export function getAuthor(id: string): BlogAuthor | null {
  const author = authors.find((a) => getIdFromPath(a.info.path) === id)
  if (!author) return null
  return {
    id: getIdFromPath(author.info.path),
    name: author.name,
    avatar: author.avatar,
    bio: author.bio,
    twitter: author.twitter,
    github: author.github,
    website: author.website,
  }
}

export function getCategories(): BlogCategory[] {
  return categories.map((category) => ({
    id: getIdFromPath(category.info.path),
    name: category.name,
    description: category.description,
    slug: category.slug,
  }))
}

export function getCategory(slug: string): BlogCategory | null {
  const category = categories.find((c) => c.slug === slug)
  if (!category) return null
  return {
    id: getIdFromPath(category.info.path),
    name: category.name,
    description: category.description,
    slug: category.slug,
  }
}

export function getBlogPosts(lang?: string) {
  const language = lang || i18n.defaultLanguage
  const pages = blogSource.getPages(language)
  return pages
    .filter((page) => (page.data as BlogFrontmatter).published !== false)
    .sort(
      (a, b) =>
        new Date((b.data as BlogFrontmatter).date).getTime() -
        new Date((a.data as BlogFrontmatter).date).getTime()
    )
}

export function getBlogPostsByCategory(categorySlug: string, lang?: string) {
  return getBlogPosts(lang).filter((post) =>
    (post.data as BlogFrontmatter).categories.includes(categorySlug)
  )
}

export function getBlogPostsByAuthor(authorId: string, lang?: string) {
  return getBlogPosts(lang).filter((post) => (post.data as BlogFrontmatter).author === authorId)
}

export function getBlogPost(slug: string[], lang?: string) {
  const language = lang || i18n.defaultLanguage
  return blogSource.getPage(slug, language)
}

export function mapToBlogPost(
  post: ReturnType<typeof blogSource.getPages>[number]
): BlogPost {
  const data = post.data as BlogFrontmatter
  return {
    slug: post.slugs.join("/"),
    url: post.url,
    title: data.title,
    description: data.description,
    image: data.image,
    date: data.date.toISOString(),
    categories: data.categories,
    author: data.author,
    tags: data.tags,
  }
}
