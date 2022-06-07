import { useCallback, useState } from "react";

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const [data, setData] = useState<T>(
    (localStorage.getItem(resolveName(key)) ?? defaultValue) as T,
  );

  const setDataCallback = useCallback(
    (data: any) => {
      localStorage.setItem(resolveName(key), data);
      setData(data);
    },
    [setData, key],
  );

  return [data, setDataCallback] as const;
}

function resolveName(key: string) {
  return `_useLocalStorage_${key}`;
}
