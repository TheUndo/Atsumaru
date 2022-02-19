import { useCallback, useState } from "react";

export default function useLocalStorage(key: string) {

    const [data, setData] = useState(localStorage.getItem(resolveName(key)));

    const setDataCallback = useCallback((data: any) => {
        localStorage.setItem(resolveName(key), data);
        setData(data);
    }, [setData, key]);

    return [data, setDataCallback] as const;
}

function resolveName(key: string) {
    return `_useLocalStorage_${key}`;
}