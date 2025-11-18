import { Store, ShoppingBag, Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PageLoaderVariant = "store" | "product" | "categories";

type PageLoaderMode = "fullscreen" | "inline";

type PageLoaderProps = {
  variant: PageLoaderVariant;
  title: string;
  subtitle?: string;
  fadingOut?: boolean;
  mode?: PageLoaderMode;
  className?: string;
};

const variantStyles: Record<
  PageLoaderVariant,
  {
    accent: string;
    iconColor: string;
    ring: string;
    taglineFallback: string;
  }
> = {
  store: {
    accent: "from-orange-500/20 via-orange-400/10 to-orange-500/5",
    iconColor: "text-orange-500",
    ring: "border-orange-400/40",
    taglineFallback: "Setting up the storefront for you",
  },
  product: {
    accent: "from-primary/20 via-primary/10 to-primary/5",
    iconColor: "text-primary",
    ring: "border-primary/40",
    taglineFallback: "Inspecting product details",
  },
  categories: {
    accent: "from-emerald-400/20 via-emerald-400/10 to-emerald-400/5",
    iconColor: "text-emerald-500",
    ring: "border-emerald-400/40",
    taglineFallback: "Curating categories",
  },
};

const renderGraphic = (variant: PageLoaderVariant) => {
  const baseClass =
    "relative flex items-center justify-center size-28 rounded-[28px] bg-white shadow-lg shadow-black/5 dark:bg-slate-900";

  const iconWrapperClass =
    "relative flex size-16 items-center justify-center rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-inner";

  const accentDotClass =
    "absolute size-3 rounded-full bg-current opacity-70 animate-[pulse_2s_ease-in-out_infinite]";

  switch (variant) {
    case "store":
      return (
        <div className={cn(baseClass, "text-orange-500")}>
          <div
            className="absolute -inset-3 rounded-[32px] border border-orange-400/30"
            aria-hidden
          />
          <div className={iconWrapperClass}>
            <Store className="size-10" strokeWidth={1.6} />
          </div>
          <span className={cn(accentDotClass, "-top-3 left-8")} />
          <span className={cn(accentDotClass, "bottom-2 right-6 delay-150")} />
          <span className={cn(accentDotClass, "top-4 -right-2 delay-300")} />
        </div>
      );
    case "product":
      return (
        <div className={cn(baseClass, "text-primary")}>
          <div
            className="absolute -inset-3 rounded-[32px] border border-primary/30"
            aria-hidden
          />
          <div className={iconWrapperClass}>
            <ShoppingBag className="size-10" strokeWidth={1.6} />
          </div>
          <span className={cn(accentDotClass, "-bottom-3 left-6 delay-100")} />
          <span className={cn(accentDotClass, "top-2 right-7 delay-200")} />
          <span className={cn(accentDotClass, "-top-2 -right-1 delay-300")} />
        </div>
      );
    case "categories":
      return (
        <div className={cn(baseClass, "text-emerald-500")}>
          <div
            className="absolute -inset-3 rounded-[32px] border border-emerald-400/30"
            aria-hidden
          />
          <div className={iconWrapperClass}>
            <Grid2x2 className="size-10" strokeWidth={1.6} />
          </div>
          <span className={cn(accentDotClass, "top-2 left-4 delay-200")} />
          <span className={cn(accentDotClass, "-bottom-3 right-5 delay-300")} />
          <span className={cn(accentDotClass, "-top-3 right-10 delay-75")} />
        </div>
      );
  }
};

const LoaderBody = ({
  variant,
  title,
  subtitle,
}: Pick<PageLoaderProps, "variant" | "title" | "subtitle">) => {
  const config = variantStyles[variant];

  return (
    <div className="flex flex-col items-center gap-6 px-6 text-center">
      <div className="relative">
        <div
          className={cn(
            "absolute inset-[-25%] rounded-full bg-gradient-to-br blur-3xl",
            config.accent
          )}
          aria-hidden
        />
        <div className="relative flex items-center justify-center">
          <div
            className={cn(
              "absolute inset-[-18%] rounded-[28px] border",
              config.ring,
              "opacity-50"
            )}
            aria-hidden
          />
          <div
            className={cn(
              "absolute inset-[-32%] rounded-[32px] border",
              config.ring,
              "opacity-30 animate-[ping_2s_ease-out_infinite]"
            )}
            aria-hidden
          />
          <div className={cn("relative", config.iconColor)}>
            {renderGraphic(variant)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          {subtitle || config.taglineFallback}
        </p>
      </div>
    </div>
  );
};

export const PageLoader = ({
  variant,
  title,
  subtitle,
  fadingOut,
  mode = "fullscreen",
  className,
}: PageLoaderProps) => {
  if (mode === "inline") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <LoaderBody variant={variant} title={title} subtitle={subtitle} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center bg-background/96 backdrop-blur-sm transition-opacity duration-500 ease-out",
        className,
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      aria-live="polite"
      aria-busy={!fadingOut}
    >
      <LoaderBody variant={variant} title={title} subtitle={subtitle} />
    </div>
  );
};

