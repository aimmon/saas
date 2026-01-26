import type { BlogPost } from "@/shared/types/blog"
import BlogCard, { BlogCardSkeleton } from "./blog-card"

type BlogGridProps = {
  posts: BlogPost[]
  categories?: Array<{ id: string; name: string; slug: string }>
}

export default function BlogGrid({ posts, categories = [] }: BlogGridProps) {
  if (!posts?.length) return null

  return (
    <div className="mx-auto w-full max-w-7xl px-8">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post, index) => {
          const key = post.slug || `post-${index}`
          return (
            <BlogCard
              key={key}
              post={post}
              categories={categories}
            />
          )
        })}
      </div>
    </div>
  )
}

export function BlogGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-8">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(count)].map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
