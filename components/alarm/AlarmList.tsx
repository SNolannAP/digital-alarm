"use client";

import { Alarm } from "@/lib/alarm";
import { AlarmItem } from "./AlarmItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";

interface AlarmListProps {
  alarms: Alarm[];
  onToggleAlarm: (id: string, enabled: boolean) => void;
  onDeleteAlarm: (id: string) => void;
}

export function AlarmList({
  alarms,
  onToggleAlarm,
  onDeleteAlarm,
}: AlarmListProps) {
  const sortedAlarms = [...alarms].sort((a, b) => {
    // Enabled alarms first
    if (a.enabled !== b.enabled) {
      return a.enabled ? -1 : 1;
    }
    
    // Then by time
    if (a.time !== b.time) {
      return a.time.localeCompare(b.time);
    }
    
    // Finally by creation date (newest first)
    return b.created.getTime() - a.created.getTime();
  });

  if (sortedAlarms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Bell className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-1">No alarms set</h3>
        <p className="text-muted-foreground max-w-sm">
          Add your first alarm by clicking the plus button below.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 pr-4 -mr-4">
      <div className="space-y-4">
        {sortedAlarms.map((alarm) => (
          <AlarmItem
            key={alarm.id}
            alarm={alarm}
            onToggle={onToggleAlarm}
            onDelete={onDeleteAlarm}
          />
        ))}
      </div>
    </ScrollArea>
  );
}