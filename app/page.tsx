"use client";

import { ThemeProvider } from "next-themes";
import { DigitalClock } from "@/components/clock/DigitalClock";
import { DateDisplay } from "@/components/clock/DateDisplay";
import { AlarmList } from "@/components/alarm/AlarmList";
import { AlarmAlertDialog } from "@/components/alarm/AlarmAlert";
import { FloatingActionButton } from "@/components/alarm/FloatingActionButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAlarms } from "@/hooks/useAlarms";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

export default function Home() {
  const {
    alarms,
    currentAlert,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    snoozeAlarm,
    dismissAlarm,
  } = useAlarms();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h1 className="font-semibold text-lg select-none">Digital Alarm</h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pb-24">
          <div className="flex flex-col items-center justify-center py-8 md:py-12">
            <DigitalClock className="mb-3" />
            <DateDisplay />
          </div>

          <Separator className="my-8" />

          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Your Alarms</h2>
            <AlarmList
              alarms={alarms}
              onToggleAlarm={toggleAlarm}
              onDeleteAlarm={deleteAlarm}
            />
          </div>
        </main>

        <FloatingActionButton onAddAlarm={addAlarm} />

        <AlarmAlertDialog
          alert={currentAlert}
          onSnooze={snoozeAlarm}
          onDismiss={dismissAlarm}
        />
      </div>
    </ThemeProvider>
  );
}