"use client";

import { useState, useMemo } from "react";
import { Clock, Check, X, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createAlarm, Alarm } from "@/lib/alarm";

interface AlarmFormProps {
  onAddAlarm: (alarm: Alarm) => void;
  trigger: React.ReactNode;
}

export function AlarmForm({ onAddAlarm, trigger }: AlarmFormProps) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("08:00");
  const [period, setPeriod] = useState("AM");
  const [label, setLabel] = useState("");
  const [hasDuration, setHasDuration] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(30);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert selected time to 24-hour format
    const [hour, minute] = time.split(":").map(Number);
    const hour24 = period === "PM" && hour !== 12 ? hour + 12 : period === "AM" && hour === 12 ? 0 : hour;
    const formattedTime = `${hour24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    const newAlarm = createAlarm(
      formattedTime,
      label.trim(),
      hasDuration,
      hasDuration ? durationMinutes : 0
    );

    onAddAlarm(newAlarm);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTime("08:00");
    setPeriod("AM");
    setLabel("");
    setHasDuration(false);
    setDurationMinutes(30);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Add New Alarm</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="flex justify-center items-center gap-2">
              <select
                id="hours"
                value={time.split(":")[0]}
                onChange={(e) => setTime(`${e.target.value}:${time.split(":")[1]}`)}
                className="border rounded px-2 py-1 text-base"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                id="minutes"
                value={time.split(":")[1]}
                onChange={(e) => setTime(`${time.split(":")[0]}:${e.target.value}`)}
                className="border rounded px-2 py-1 text-base"
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <select
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="border rounded px-2 py-1 text-base"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="label">Label (optional)</Label>
            <Input 
              id="label"
              placeholder="E.g., Wake up, Meeting, etc."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={50}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hasDuration"
              checked={hasDuration}
              onCheckedChange={(checked) => setHasDuration(checked === true)}
            />
            <Label 
              htmlFor="hasDuration" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Set Duration
            </Label>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-transparent select-none">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Duration help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="select-none">Set a duration for the alarm to automatically stop after a specific time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {hasDuration && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration"
                type="number" 
                min={1}
                max={1440}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                required={hasDuration}
              />
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="gap-2.5"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="gap-1">
              <Check className="h-4 w-4" />
              Add Alarm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}