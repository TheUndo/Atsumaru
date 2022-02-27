import { useEffect, useState } from "react";

export default function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const event = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener("online", event);
    window.addEventListener("offline", event);
    return () => {
      window.removeEventListener("online", event);
      window.removeEventListener("offline", event);
    };
  }, []);

  return online;
}
