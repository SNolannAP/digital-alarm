"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DateDisplayProps {
  className?: string;
}

export function DateDisplay({ className }: DateDisplayProps) {
  const [date, setDate] = useState<string>("");
  
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setDate(now.toLocaleDateString('en-US', options));
    };
    
    // Update immediately
    updateDate();
    
    // Update every minute (in case we cross midnight)
    const interval = setInterval(updateDate, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("text-center text-muted-foreground", className)}>
      <p className="text-lg md:text-xl font-medium transition-all">
        {date}
      </p>
    </div>
  );
}