import { BrainIcon, CheckIcon, EyeIcon, FileTextIcon, SearchIcon, SparklesIcon } from "lucide-react"
import { memo, useCallback, useMemo, useState } from "react"
import { useIntlayer } from "react-intlayer"
import { models } from "@/integrations/ai/models"
import type { AIModelMeta } from "@/integrations/ai/types"
import { ModelSelectorLogo } from "@/shared/components/ai-elements/model-selector"
import { Input } from "@/shared/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import { cn } from "@/shared/lib/utils"

const BRAND_LOGO_OVERRIDES: Record<string, string> = {
  qwen: "alibaba",
  glm: "zhipuai",
  kimi: "moonshotai",
}

function getBrand(modelId: string): string {
  return modelId.split("/")[0] || "other"
}

function getBrandLogo(brand: string): string {
  return BRAND_LOGO_OVERRIDES[brand] || brand
}

type BrandGroup = { brand: string; logo: string; models: AIModelMeta[] }

function buildBrandGroups(allModels: AIModelMeta[]): BrandGroup[] {
  const map: Record<string, AIModelMeta[]> = {}
  const order: string[] = []
  for (const m of allModels) {
    const brand = getBrand(m.id)
    if (!map[brand]) {
      map[brand] = []
      order.push(brand)
    }
    map[brand].push(m)
  }
  return order.map((brand) => ({
    brand,
    logo: getBrandLogo(brand),
    models: map[brand],
  }))
}

interface ModelItemProps {
  model: AIModelMeta
  isSelected: boolean
  onSelect: (id: string) => void
}

const ModelItem = memo(({ model, isSelected, onSelect }: ModelItemProps) => {
  const handleSelect = useCallback(() => onSelect(model.id), [onSelect, model.id])

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
        "hover:bg-accent",
        isSelected && "bg-accent"
      )}
    >
      <ModelSelectorLogo
        provider={getBrandLogo(getBrand(model.id))}
        className="size-5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{model.label}</span>
          {model.tier === "pro" && (
            <span className="shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              PRO
            </span>
          )}
          {model.isNew && (
            <span className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              NEW
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{model.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {model.capabilities.vision && (
          <div className="inline-flex items-center justify-center rounded bg-secondary/50 p-1">
            <EyeIcon className="size-3 text-muted-foreground" />
          </div>
        )}
        {model.capabilities.reasoning && (
          <div className="inline-flex items-center justify-center rounded bg-secondary/50 p-1">
            <BrainIcon className="size-3 text-muted-foreground" />
          </div>
        )}
        {model.capabilities.pdf && (
          <div className="inline-flex items-center justify-center rounded bg-secondary/50 p-1">
            <FileTextIcon className="size-3 text-muted-foreground" />
          </div>
        )}
        {isSelected && <CheckIcon className="ml-1 size-4 text-primary" />}
      </div>
    </button>
  )
})

ModelItem.displayName = "ModelItem"

export type ModelPickerProps = {
  selectedModel: string
  onModelSelect: (id: string) => void
}

export function ModelPicker({ selectedModel, onModelSelect }: ModelPickerProps) {
  const { modelPicker: i18n } = useIntlayer("ai")
  const [open, setOpen] = useState(false)
  const [activeBrand, setActiveBrand] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const brandGroups = useMemo(() => buildBrandGroups(models), [])

  const currentBrand = activeBrand ?? brandGroups[0]?.brand ?? "openai"

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) {
      return brandGroups.find((g) => g.brand === currentBrand)?.models ?? []
    }
    return models.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    )
  }, [searchQuery, currentBrand, brandGroups])

  const currentBrandGroup = brandGroups.find((g) => g.brand === currentBrand)

  const selectedModelData = useMemo(
    () => models.find((m) => m.id === selectedModel),
    [selectedModel]
  )

  const handleModelSelect = useCallback(
    (id: string) => {
      onModelSelect(id)
      setOpen(false)
    },
    [onModelSelect]
  )

  const selectedBrand = selectedModelData ? getBrand(selectedModelData.id) : "openai"

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setSearchQuery("")
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ModelSelectorLogo provider={getBrandLogo(selectedBrand)} />
          <span className="truncate text-left">
            {selectedModelData?.label || i18n.selectModel.value}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-2xl gap-0 overflow-hidden p-0"
      >
        <div className="flex h-96">
          <div className="flex w-14 shrink-0 flex-col items-center gap-1 overflow-hidden border-r bg-muted/30 py-3">
            <TooltipProvider delayDuration={0}>
              <ScrollArea className="flex-1 overflow-hidden no-scrollbar">
                <div className="flex flex-col items-center gap-1 px-1.5 pb-2">
                  {brandGroups.map((group) => (
                    <Tooltip key={group.brand}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveBrand(group.brand)
                            setSearchQuery("")
                          }}
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg transition-colors",
                            "hover:bg-accent",
                            currentBrand === group.brand &&
                              !searchQuery &&
                              "bg-accent ring-1 ring-border"
                          )}
                        >
                          <ModelSelectorLogo
                            provider={group.logo}
                            className="size-4"
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="text-xs"
                      >
                        {group.brand.charAt(0).toUpperCase() + group.brand.slice(1)}
                        <span className="ml-1 text-muted-foreground">({group.models.length})</span>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ScrollArea>
            </TooltipProvider>
          </div>

          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            <div className="border-b px-4 py-3">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={i18n.searchPlaceholder.value}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {!searchQuery && currentBrandGroup && (
              <div className="flex items-center gap-2 border-b px-4 py-2.5">
                <ModelSelectorLogo
                  provider={currentBrandGroup.logo}
                  className="size-4"
                />
                <span className="text-sm font-medium">
                  {currentBrandGroup.brand.charAt(0).toUpperCase() +
                    currentBrandGroup.brand.slice(1)}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {currentBrandGroup.models.length} {i18n.modelsCount.value}
                </span>
              </div>
            )}

            {searchQuery && (
              <div className="flex items-center gap-2 border-b px-4 py-2.5">
                <SparklesIcon className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">{i18n.searchResults.value}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {filteredModels.length} {i18n.modelsCount.value}
                </span>
              </div>
            )}

            <ScrollArea className="flex-1 overflow-hidden no-scrollbar">
              <div className="flex flex-col gap-0.5 p-2">
                {filteredModels.length > 0 ? (
                  filteredModels.map((m) => (
                    <ModelItem
                      key={m.id}
                      model={m}
                      isSelected={selectedModel === m.id}
                      onSelect={handleModelSelect}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                    {i18n.noModelsFound.value}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
