"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isCurrent?: boolean;
  isDisabled?: boolean;
  onSelect: () => void;
  buttonText: string;
}

export function SubscriptionCard({
  title,
  price,
  description,
  features,
  isCurrent = false,
  isDisabled = false,
  onSelect,
  buttonText,
}: SubscriptionCardProps) {
  const getButtonVariant = (title: string) => {
    if (isCurrent) return "ghost";
    if (title === "Free") return "outline";
    return "default";
  };

  const handleSelect = () => {
    if (!isDisabled) {
      onSelect();
    }
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-lg flex flex-col h-full",
        isCurrent && "ring-2 ring-primary",
        isDisabled && "opacity-75"
      )}
    >
      {/* Coming Soon Overlay */}
      {/* {isDisabled && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium text-primary">Coming Soon</p>
            <p className="text-xs text-primary mt-1">
              This plan will be available soon
            </p>
          </div>
        </div>
      )} */}

      <CardHeader className="text-center pb-2 flex-shrink-0">
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="text-3xl font-bold text-primary">
          {price}
          {price !== "Free" && (
            <span className="text-sm text-muted-foreground font-normal">
              /month
            </span>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <ul className="space-y-2 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-4 h-4 flex-shrink-0 mr-2 mt-0.5 text-green-500" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className={cn(
            "w-full mt-auto",
            price === "Free" && "pointer-events-none"
          )}
          variant={getButtonVariant(title)}
          onClick={handleSelect}
          disabled={isCurrent || isDisabled}
        >
          {isCurrent ? "Currently using" : buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
