export type BlogPost = {
  slug: string
  url: string
  title: string
  description?: string
  image?: string
  date: string
  categories: string[]
  author: string
  tags: string[]
}

export type BlogAuthor = {
  id: string
  name: string
  avatar?: string
  bio?: string
  twitter?: string
  github?: string
  website?: string
}

export type BlogCategory = {
  id: string
  name: string
  description?: string
  slug: string
}
