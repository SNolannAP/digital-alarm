"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DigitalClockProps {
  className?: string;
}

export function DigitalClock({ className }: DigitalClockProps) {
  const [time, setTime] = useState<string>("00:00:00 AM");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours24 = now.getHours();
      const hours = hours24 % 12 || 12; // Convert to 12-hour format
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours24 >= 12 ? "PM" : "AM";
      setTime(`${hours.toString().padStart(2, "0")}:${minutes}:${seconds} ${ampm}`);
    };

    // Update immediately
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("text-center", className)}>
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter font-mono transition-all">
        {time.match(/(\d{2}:\d{2}:\d{2}) (AM|PM)/)?.slice(1).map((part, index) => (
          <span
            key={index}
            className={cn(
              "inline-block transition-all duration-200 transform",
              index === 1
                ? "text-primary/80 text-4xl md:text-6xl align-top ml-2"
                : "min-w-[1ch] text-primary"
            )}
          >
            {part}
          </span>
        ))}
      </h1>
    </div>
  );
}