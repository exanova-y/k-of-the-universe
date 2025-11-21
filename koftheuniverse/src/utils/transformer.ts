export const WATTS_PER_BTC_MINED = 1.4e12; // Rough estimate of energy to mine 1 BTC in Joules

export function wattsToJouleMin(watts: number): number {
  return watts * 60;
}

export function calculateKardashev(watts: number): number {
  // K = (log10(P) - 6) / 10
  if (watts <= 0) return -Infinity;
  return (Math.log10(watts) - 6) / 10;
}

export function calculateBitcoinStats(watts: number): string {
  // Energy for 1 BTC ~ 1.4e12 Joules
  // Power P (J/s)
  // Time to mine 1 BTC = 1.4e12 / P seconds
  
  const joulesPerBTC = 1.4e12;
  const secondsPerBTC = joulesPerBTC / watts;

  if (secondsPerBTC < 60) {
    const btcPerSecond = watts / joulesPerBTC;
    const btcPerDay = btcPerSecond * 86400;
    return `Can mine ~${btcPerDay.toFixed(2)} Bitcoins per day`;
  } else {
    // Convert seconds to human readable
    const minutes = secondsPerBTC / 60;
    if (minutes < 60) return `Takes ~${minutes.toFixed(1)} minutes to mine 1 Bitcoin`;
    const hours = minutes / 60;
    if (hours < 24) return `Takes ~${hours.toFixed(1)} hours to mine 1 Bitcoin`;
    const days = hours / 24;
    if (days < 365) return `Takes ~${days.toFixed(1)} days to mine 1 Bitcoin`;
    const years = days / 365;
    if (years > 1e9) return `Takes > 1 billion years to mine 1 Bitcoin`;
    return `Takes ~${years.toLocaleString(undefined, {maximumFractionDigits: 1})} years to mine 1 Bitcoin`;
  }
}

export function formatNumber(num: number): string {
  if (Math.abs(num) < 0.01 || Math.abs(num) > 10000) {
    return num.toExponential(2);
  }
  return num.toLocaleString();
}

