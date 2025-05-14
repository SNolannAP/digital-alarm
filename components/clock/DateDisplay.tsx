"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DateDisplayProps {
  className?: string;
}

export function DateDisplay({ className }: DateDisplayProps) {
  const [date, setDate] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
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
    
    updateDate();
    
    const interval = setInterval(updateDate, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("text-center text-muted-foreground", className)}>
      <p className="text-lg md:text-xl font-medium transition-all">
        {date}
      </p>
    </div>
  );
}