import { AnimatedThemeToggler } from "@/shared/components/ui/animated-theme-toggler"
import { buttonVariants } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"

type ThemeSwitcherProps = {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  return (
    <AnimatedThemeToggler
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "cursor-pointer",
        className
      )}
    />
  )
}
