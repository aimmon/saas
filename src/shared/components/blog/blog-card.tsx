import { Image } from "@unpic/react"
import { LocalizedLink, type To } from "@/shared/components/locale/localized-link"
import type { BlogPost } from "@/shared/types/blog"

type BlogCardProps = {
  post: BlogPost
  categories?: Array<{ id: string; name: string; slug: string }>
}

export default function BlogCard({ post, categories = [] }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const categoryLabels = post.categories
    .map((slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug)
    .filter(Boolean)

  return (
    <LocalizedLink
      to={`/blog/${post.slug}` as To}
      className="block w-full max-w-sm"
    >
      <article className="group w-full transition-transform duration-200 hover:scale-[1.02]">
        <div className="relative w-full aspect-square overflow-hidden rounded-md bg-muted">
          {post.image ? (
            <Image
              alt={post.title}
              layout="fullWidth"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              src={post.image}
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">{formattedDate}</div>

          <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors line-clamp-2 group-hover:text-primary">
            {post.title}
          </h3>

          <div className="flex flex-wrap gap-2">
            {categoryLabels.map((label: string, index: number) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs whitespace-nowrap"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </article>
    </LocalizedLink>
  )
}

export function BlogCardSkeleton() {
  return (
    <article className="group w-full max-w-sm">
      <div className="w-full aspect-square bg-muted rounded-md animate-pulse" />

      <div className="mt-4">
        <div className="h-4 w-20 bg-muted rounded mb-2 animate-pulse" />
        <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
        <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
      </div>
    </article>
  )
}
