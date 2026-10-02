import * as React from "react";

export function useGameTimer(totalSeconds: number, enabled: boolean) {
  const [secondsLeft, setSecondsLeft] = React.useState(totalSeconds);

  React.useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  React.useEffect(() => {
    if (!enabled) return;
    if (secondsLeft <= 0) return;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [enabled, secondsLeft]);

  const reset = React.useCallback(() => setSecondsLeft(totalSeconds), [totalSeconds]);

  return {
    secondsLeft,
    isExpired: secondsLeft <= 0,
    reset,
  };
}

