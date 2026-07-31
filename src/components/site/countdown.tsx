import { useEffect, useState } from "react";

function diff(target: string) {
  const ms = new Date(target).getTime() - Date.now();
  const clamped = Math.max(ms, 0);
  return {
    days: Math.floor(clamped / 86400000),
    hours: Math.floor((clamped / 3600000) % 24),
    minutes: Math.floor((clamped / 60000) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    done: ms <= 0,
  };
}

export function Countdown({ target }: { target: string }) {
  const [time, setTime] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => setTime(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const items = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="glass rounded-2xl px-2 py-4 text-center">
          <p className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
            {mounted ? String(item.value).padStart(2, "0") : "--"}
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest opacity-80">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}