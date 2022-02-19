import { useCallback, useLayoutEffect, useState } from "react";
import useCache from "./useCache";


export default function useApi<T>(path: string, maxAge?: number) {

    const [data, setData] = useCache<T>(path);
    const [error, setError] = useState<string>();
    const [loading, setIsLoading] = useState(data ? false : true);

    useLayoutEffect(() => {
        performRequest();
    }, [path]);

    const performRequest = useCallback(() => {
        setError(undefined);
        setIsLoading(true);

        (async () => {
            try {
                const req = await fetch(getUrl(path));
                const res = await req.json();

                setData(res, maxAge);
            } catch (e: any) {
                setError(e?.toString() || "Unknown error, try again later.");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [path]);

    return {
        data,
        error,
        loading,
    }
}


function getUrl(path: string) {
    //const apiBase = "/api/v1";
    const apiBase = ["localhost", "local.com"].includes(location.hostname) ? "http://localhost:4000/api/v1" : "/api/v1";
    return /^https?:\/\//.test(path) ? path : `${apiBase}${path}`;
}