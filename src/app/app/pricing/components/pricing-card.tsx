"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary";
  popular?: boolean;
  onClick?: () => void;
}

export function PricingCard({
  name,
  description,
  price,
  billingPeriod,
  features,
  buttonText,
  buttonVariant = "default",
  popular = false,
  onClick,
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "flex flex-col h-full transition-all duration-300 transform",
        popular && "border-primary shadow-lg relative",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {popular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader
        className={cn("flex flex-col space-y-1.5", popular && "pt-8")}
      >
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">${price}</span>
          {price > 0 && (
            <span className="text-muted-foreground ml-2">
              /{billingPeriod === "monthly" ? "month" : "year"}
            </span>
          )}
        </div>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          variant={buttonVariant}
          className={cn(
            "w-full transition-all",
            popular &&
              buttonVariant === "default" &&
              "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
