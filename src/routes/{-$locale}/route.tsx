import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getPathWithoutLocale, getPrefix, Locales, validatePrefix } from "intlayer"
import { IntlayerProvider, useLocale } from "react-intlayer"
import { GlobalNotFoundComponent } from "@/shared/components/landing/not-found"
import { setLocaleCookie } from "@/shared/lib/locale/locale-cookie"
import { blockMiddleware } from "@/shared/middleware/block.middleware"
import { localeRedirectMiddleware } from "@/shared/middleware/locale-redirect.middleware"

const LOCALE_STORAGE_KEY = "INTLAYER_LOCALE"

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params, location }) => {
    const localeParam = params.locale
    const { isValid, localePrefix } = validatePrefix(localeParam)

    if (!isValid) {
      throw redirect({
        to: "/{-$locale}/404",
        params: { locale: localePrefix },
      })
    }

    if (typeof window !== "undefined") {
      const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
      const urlLocale = localeParam || Locales.ENGLISH

      if (storedLocale && urlLocale !== storedLocale) {
        if (!localeParam) {
          const { localePrefix: storedPrefix } = getPrefix(storedLocale)
          const pathWithoutLocale = getPathWithoutLocale(location.pathname)

          throw redirect({
            to: `/{-$locale}${pathWithoutLocale}` as string,
            params: { locale: storedPrefix } as never,
            replace: true,
          })
        } else {
          localStorage.setItem(LOCALE_STORAGE_KEY, urlLocale)
          setLocaleCookie(urlLocale)
        }
      }
    }
  },
  server: {
    middleware: [localeRedirectMiddleware, blockMiddleware],
  },
  component: LayoutComponent,
  notFoundComponent: NotFoundLayout,
})

function LayoutComponent() {
  const { defaultLocale } = useLocale()
  const { locale } = Route.useParams()

  return (
    <IntlayerProvider locale={locale ?? defaultLocale}>
      <Outlet />
    </IntlayerProvider>
  )
}

function NotFoundLayout() {
  const { defaultLocale } = useLocale()
  const { locale } = Route.useParams()

  return (
    <IntlayerProvider locale={locale ?? defaultLocale}>
      <GlobalNotFoundComponent />
    </IntlayerProvider>
  )
}
