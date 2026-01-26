import { FileX2 } from "lucide-react"

type EmptyBlogProps = {
  title?: string
  description?: string
}

export default function EmptyBlog({
  title = "No posts yet",
  description = "Check back soon for new content!",
}: EmptyBlogProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <FileX2 className="size-16 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">{description}</p>
    </div>
  )
}
