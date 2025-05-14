export type Alarm = {
  id: string;
  time: string; // format "HH:MM"
  enabled: boolean;
  label: string;
  hasDuration: boolean;
  durationMinutes: number;
  created: Date;
};

export type AlarmAlert = {
  alarm: Alarm;
  triggered: Date;
  ends?: Date; // Only set if the alarm has a duration
};

export function createAlarm(
  time: string,
  label: string = "",
  hasDuration: boolean = false,
  durationMinutes: number = 0
): Alarm {
  return {
    id: generateId(),
    time,
    enabled: true,
    label,
    hasDuration,
    durationMinutes,
    created: new Date(),
  };
}

export function formatTime(time: string): string {
  // Convert 24h to 12h format
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function checkAlarms(alarms: Alarm[]): Alarm | null {
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, "0");
  const currentMinute = now.getMinutes().toString().padStart(2, "0");
  const currentTime = `${currentHour}:${currentMinute}`;

  return alarms.find(alarm => 
    alarm.enabled && 
    alarm.time === currentTime &&
    // Check that we haven't already triggered this alarm in the current minute
    (now.getSeconds() < 10) // Only trigger in the first 10 seconds of the minute
  ) || null;
}

export function calculateEndTime(alarm: Alarm, startTime: Date): Date | undefined {
  if (!alarm.hasDuration) return undefined;
  
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + alarm.durationMinutes);
  return endTime;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}