"use client";

import { useState, useEffect, useCallback } from "react";
import { Alarm, AlarmAlert, checkAlarms, calculateEndTime } from "@/lib/alarm";

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [currentAlert, setCurrentAlert] = useState<AlarmAlert | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedAlarms = localStorage.getItem("alarms");
    if (savedAlarms) {
      try {
        const parsed = JSON.parse(savedAlarms);
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

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms, mounted]);

  useEffect(() => {
    if (!mounted) return;
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
  }, [alarms, currentAlert, mounted]);

  const addAlarm = useCallback((alarm: Alarm) => {
    setAlarms(prev => [...prev, alarm]);
  }, []);

  const toggleAlarm = useCallback((id: string, enabled: boolean) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, enabled } : alarm
      )
    );
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  }, []);

  // Snooze an alarm
  const snoozeAlarm = useCallback(() => {
    if (!currentAlert) return;
    
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
    
    setCurrentAlert({
      ...currentAlert,
      triggered: snoozeTime,
      ends: calculateEndTime(currentAlert.alarm, snoozeTime),
    });
  }, [currentAlert]);

  const dismissAlarm = useCallback(() => {
    setCurrentAlert(null);
  }, []);

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