"use client";

import { Clock, Trash2, Bell, BellOff } from "lucide-react";
import { Alarm, formatTime, formatDuration } from "@/lib/alarm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

export function AlarmItem({ alarm, onToggle, onDelete }: AlarmItemProps) {
  const handleToggle = () => {
    onToggle(alarm.id, !alarm.enabled);
  };

  return (
    <Card className={cn(
      "transition-all duration-300 border overflow-hidden",
      alarm.enabled 
        ? "bg-card" 
        : "bg-card/50 border-dashed opacity-70"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {alarm.enabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <p className="font-semibold text-lg truncate">
                {formatTime(alarm.time)}
              </p>
            </div>
            
            {alarm.label && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {alarm.label}
              </p>
            )}
            
            {alarm.hasDuration && (
              <div className="flex items-center gap-1.5 mt-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Duration: {formatDuration(alarm.durationMinutes)}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Switch 
                id={`alarm-${alarm.id}`}
                checked={alarm.enabled}
                onCheckedChange={handleToggle}
              />
              <Label 
                htmlFor={`alarm-${alarm.id}`}
                className="sr-only"
              >
                Toggle alarm
              </Label>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete alarm</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this alarm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(alarm.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}