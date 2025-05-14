"use client";

import { useState, useEffect, useCallback } from "react";
import { Alarm, AlarmAlert, checkAlarms, calculateEndTime } from "@/lib/alarm";

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [currentAlert, setCurrentAlert] = useState<AlarmAlert | null>(null);

  // Load alarms from localStorage on initial render
  useEffect(() => {
    const savedAlarms = localStorage.getItem("alarms");
    if (savedAlarms) {
      try {
        const parsed = JSON.parse(savedAlarms);
        // Convert string dates back to Date objects
        const alarms = parsed.map((alarm: any) => ({
          ...alarm,
          created: new Date(alarm.created),
        }));
        setAlarms(alarms);
      } catch (error) {
        console.error("Error loading alarms:", error);
      }
    }
  }, []);

  // Save alarms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  // Check for alarms that should trigger
  useEffect(() => {
    // Don't check if there's already an active alert
    if (currentAlert) return;

    const intervalId = setInterval(() => {
      const triggeredAlarm = checkAlarms(alarms);
      
      if (triggeredAlarm) {
        const now = new Date();
        const alert: AlarmAlert = {
          alarm: triggeredAlarm,
          triggered: now,
          ends: calculateEndTime(triggeredAlarm, now),
        };
        setCurrentAlert(alert);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [alarms, currentAlert]);

  // Add a new alarm
  const addAlarm = useCallback((alarm: Alarm) => {
    setAlarms(prev => [...prev, alarm]);
  }, []);

  // Toggle an alarm on/off
  const toggleAlarm = useCallback((id: string, enabled: boolean) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, enabled } : alarm
      )
    );
  }, []);

  // Delete an alarm
  const deleteAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  }, []);

  // Handle dismiss button click
  const dismissAlarm = useCallback(() => {
    if (currentAlert) {
      // Delete the alarm that triggered the alert
      setAlarms(prev => prev.filter(alarm => alarm.id !== currentAlert.alarm.id));
    }
    setCurrentAlert(null);
  }, [currentAlert]);

  // Handle snooze button click
  const snoozeAlarm = useCallback(() => {
    if (!currentAlert) return;

    // Create a snoozed version of the current alarm
    const now = new Date();
    const snoozeMinutes = 5;
    
    // Calculate snooze time
    const snoozeTime = new Date(now);
    snoozeTime.setMinutes(snoozeTime.getMinutes() + snoozeMinutes);
    
    const hours = snoozeTime.getHours().toString().padStart(2, "0");
    const minutes = snoozeTime.getMinutes().toString().padStart(2, "0");
    
    // Create a temporary one-time alarm
    const snoozeAlarm: Alarm = {
      ...currentAlert.alarm,
      id: `snooze-${Date.now()}`,
      time: `${hours}:${minutes}`,
      label: currentAlert.alarm.label 
        ? `${currentAlert.alarm.label} (Snoozed)`
        : "Snoozed Alarm",
      created: new Date(),
    };
    
    // Delete the original alarm that triggered this snooze
    setAlarms(prev => prev.filter(alarm => alarm.id !== currentAlert.alarm.id));
    
    // Add the snoozed alarm
    setAlarms(prev => [...prev, snoozeAlarm]);
    
    // Dismiss the current alert
    dismissAlarm();
  }, [currentAlert, dismissAlarm]);

  return {
    alarms,
    currentAlert,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    snoozeAlarm,
    dismissAlarm,
  };
}