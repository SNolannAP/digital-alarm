"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlarmForm } from "./AlarmForm";
import { Alarm } from "@/lib/alarm";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onAddAlarm: (alarm: Alarm) => void;
  className?: string;
}

export function FloatingActionButton({
  onAddAlarm,
  className,
}: FloatingActionButtonProps) {
  return (
    <div className={cn("fixed bottom-8 right-8", className)}>
      <AlarmForm
        onAddAlarm={onAddAlarm}
        trigger={
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add alarm</span>
          </Button>
        }
      />
    </div>
  );
}