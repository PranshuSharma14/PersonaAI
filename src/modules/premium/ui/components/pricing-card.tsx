"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { cva, VariantProps } from "class-variance-authority";
import { CircleCheckIcon } from "lucide-react";

const pricingCardVariants = cva(
  "rounded-xl w-full shadow-lg border border-gray-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white text-black",
        highlighted: "bg-gradient-to-br from-green-800 to-green-950 text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const pricingCardInnerVariants = cva("p-6 flex flex-col gap-y-4", {
  variants: {
    variant: {
      default: "bg-white",
      highlighted: "bg-white/10", // slight transparency for highlight
    },
  },
  defaultVariants: { variant: "default" },
});

const pricingCardIconVariants = cva("w-5 h-5", {
  variants: {
    variant: {
      default: "text-green-600",
      highlighted: "text-white",
    },
  },
  defaultVariants: { variant: "default" },
});

const pricingCardBadgeVariants = cva("text-xs font-medium px-2 py-1 rounded", {
  variants: {
    variant: {
      default: "bg-green-100 text-green-800",
      highlighted: "bg-yellow-400 text-black",
    },
  },
  defaultVariants: { variant: "default" },
});

const pricingCardSecondaryTextVariants = cva("", {
  variants: {
    variant: {
      default: "text-gray-600",
      highlighted: "text-white/90",
    },
  },
  defaultVariants: { variant: "default" },
});

interface Props extends VariantProps<typeof pricingCardVariants> {
  badge?: string | null;
  price: number;
  priceSuffix: string;
  title: string;
  description?: string | null;
  features: string[];
  buttonText: string;
  onClick: () => void;
  className?: string;
}

export const PricingCard = ({
  badge,
  price,
  priceSuffix,
  title,
  description,
  features,
  buttonText,
  variant,
  onClick,
  className,
}: Props) => {
  return (
    <div className={cn(pricingCardVariants({ variant }), className)}>
      <div className={cn(pricingCardInnerVariants({ variant }))}>
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <h3 className="text-2xl font-bold">{title}</h3>
              {badge && (
                <Badge className={cn(pricingCardBadgeVariants({ variant }))}>{badge}</Badge>
              )}
            </div>
            {description && (
              <p className={cn("text-sm", pricingCardSecondaryTextVariants({ variant }))}>
                {description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-x-1">
            <h4 className="text-3xl font-extrabold">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              }).format(price)}
            </h4>
            <span className={cn("text-sm font-medium", pricingCardSecondaryTextVariants({ variant }))}>
              {priceSuffix}
            </span>
          </div>
        </div>

        <Separator className="my-4 opacity-20" />

        {/* Features */}
        <div className="flex flex-col gap-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-x-2.5">
              <CircleCheckIcon className={cn(pricingCardIconVariants({ variant }))} />
              <span className={pricingCardSecondaryTextVariants({ variant })}>{feature}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-6">
          <Button
            className="w-full rounded-lg"
            size="lg"
            variant={variant === "highlighted" ? "default" : "outline"}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
