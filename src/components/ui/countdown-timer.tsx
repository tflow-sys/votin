import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endDate?: string;
  className?: string;
}

const CountdownTimer = ({ endDate, className }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isAlmostEnded, setIsAlmostEnded] = useState(false);

  useEffect(() => {
    // Set end date to 2 hours from now if no endDate is provided
    const targetDate = endDate
      ? new Date(endDate)
      : new Date(Date.now() + 2 * 60 * 60 * 1000);

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Check if less than 1 hour remains
      if (difference <= 3600000) {
        setIsAlmostEnded(true);
      } else {
        setIsAlmostEnded(false);
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <Card
      className={cn(
        "border shadow-md",
        isAlmostEnded ? "border-red-500 animate-pulse" : "",
        className
      )}
    >
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Time Remaining</h3>
        <div className="flex justify-between">
          <div className="text-center">
            <div
              className={cn(
                "text-2xl font-bold",
                isAlmostEnded ? "text-red-500" : ""
              )}
            >
              {timeLeft.days}
            </div>
            <div className="text-sm text-muted-foreground">Days</div>
          </div>
          <div className="text-center">
            <div
              className={cn(
                "text-2xl font-bold",
                isAlmostEnded ? "text-red-500" : ""
              )}
            >
              {timeLeft.hours}
            </div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
          <div className="text-center">
            <div
              className={cn(
                "text-2xl font-bold",
                isAlmostEnded ? "text-red-500" : ""
              )}
            >
              {timeLeft.minutes}
            </div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="text-center">
            <div
              className={cn(
                "text-2xl font-bold",
                isAlmostEnded ? "text-red-500" : ""
              )}
            >
              {timeLeft.seconds}
            </div>
            <div className="text-sm text-muted-foreground">Seconds</div>
          </div>
        </div>
        {isAlmostEnded && (
          <div className="mt-2 text-center text-red-500 font-semibold">
            Hurry! Voting closes soon
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
