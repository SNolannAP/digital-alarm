"use client";

import { useEffect, useRef, useState } from "react";
import { AlarmClock, Bell, Moon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTime, AlarmAlert } from "@/lib/alarm";
import { cn } from "@/lib/utils";

interface AlarmAlertDialogProps {
  alert: AlarmAlert | null;
  onSnooze: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function AlarmAlertDialog({
  alert,
  onSnooze,
  onDismiss,
}: AlarmAlertDialogProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [overdueMinutes, setOverdueMinutes] = useState<number | null>(null);

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audioRef.current.loop = true;
    }

    // Play sound when alert is active
    if (alert) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing alarm sound:", error);
      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [alert]);

  useEffect(() => {
    if (!alert) return;

    const updateOverdueTime = () => {
      const now = new Date();
      const triggeredTime = alert.triggered;
      const diffInMinutes = Math.floor(
        (now.getTime() - triggeredTime.getTime()) / 60000
      );

      setOverdueMinutes(diffInMinutes > 1 ? diffInMinutes : null); // Set overdue time if more than 1 minute has passed
    };

    const interval = setInterval(updateOverdueTime, 1000); // Update every second
    updateOverdueTime(); // Initial check

    return () => clearInterval(interval); // Cleanup interval
  }, [alert]);

  const handleDismiss = () => {
    if (alert) {
      onDismiss(alert.alarm.id); // Call the onDismiss callback to delete the alarm
    }
  };

  const handleSnooze = () => {
    if (alert) {
      onSnooze(alert.alarm.id); // Call the onSnooze callback to snooze and delete the alarm
    }
  };

  // No alert, don't render dialog
  if (!alert) return null;

  return (
    <Dialog open={!!alert} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary animate-pulse" />

        <DialogHeader className="animate-pulse">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Bell className="h-8 w-8 text-primary animate-bounce" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {formatTime(alert.alarm.time)}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {alert.alarm.label && (
            <p className="text-center text-lg font-medium mb-4">
              {alert.alarm.label}
            </p>
          )}

          <div
            className={cn(
              "flex items-center justify-center text-sm text-muted-foreground",
              !alert.alarm.label && "pt-2"
            )}
          >
            <AlarmClock className="h-4 w-4 mr-1.5" />
            <span>
              Alarm activated at{" "}
              {alert.triggered.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {alert.ends && (
            <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>
                Ends at{" "}
                {alert.ends.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}

          {overdueMinutes !== null && (
            <div className="mt-4 text-center text-sm text-red-500 font-medium">
              Overdue by more than {overdueMinutes} minute
              {overdueMinutes > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            className="w-full sm:w-1/2 gap-2"
            variant="outline"
            onClick={handleSnooze}
          >
            <Moon className="h-4 w-4" />
            Snooze 5 min
          </Button>
          <Button className="w-full sm:w-1/2" onClick={handleDismiss}>
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}