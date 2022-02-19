import { useState } from "react";
import { doGarbageCollect } from "../sw";


export default function useCache<T>(key: string) {

    const [cache, setData] = useState<T>(getCache(key));

    const setCache = (content: any, maxAge?: number) => {
        setData(storeCache<T>(key, content, maxAge));
    }
    return [cache, setCache] as const;
}


function getCache(key: string) {
    const item = localStorage.getItem(resolveKey(key));
    try {
        const parsed = JSON.parse(item!);
        if (!parsed) return null;
        if (parsed.maxAge && Date.now() > parsed.maxAge)
            return null;
        else
            return parsed.content;
    } catch (e) {
        doGarbageCollect();
        return null;
    }
}
function storeCache<T>(key: string, content: T, maxAge?: number) {
    try {
        localStorage.setItem(resolveKey(key), JSON.stringify({
            maxAge: maxAge ? Date.now() + maxAge : null,
            content,
        }));
    } catch (e) {
        doGarbageCollect();
    }
    return content;
}
function resolveKey(key: string) {
    return `__useCache_${key}`;
}