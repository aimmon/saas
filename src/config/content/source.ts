import { docs } from "fumadocs-mdx:collections/server"
import { loader } from "fumadocs-core/source"
import { i18n } from "../../shared/lib/i18n"

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
})
