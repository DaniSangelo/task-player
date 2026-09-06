export function formatSecondsToTime(dailyWorkedSeconds: number): { hours: string, minutes: string, seconds: string } {
  const hours = Math.floor(dailyWorkedSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((dailyWorkedSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(dailyWorkedSeconds % 60)
    .toString()
    .padStart(2, "0");
  return { hours, minutes, seconds }
}