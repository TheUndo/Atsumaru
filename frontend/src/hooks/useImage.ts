import { useEffect, useLayoutEffect, useState } from "react";

export default function useImage(sources: (string | undefined | null)[], backup?: string) {
    const [image, setImage] = useState<string>();
    const [fail, setFail] = useState(false);
    const [updates, retry] = useState(1);
    const [imgObject, setImgObject] = useState(new Image());
    const [loading, setLoading] = useState(true);
    const filteredSources = sources.filter(v => v) as string[];
    const [snapshot, setSnapshot] = useState(0);


    useLayoutEffect(() => {
        if (!filteredSources.length) return;

        let i = 0;
        const set = () => {
            const src = filteredSources[i];
            setSnapshot(updates);
            imgObject.src = src;
        }
        const event = () => {
            if (!loading) return;
            const src = filteredSources[i];
            void setImage(src);
            void setLoading(false);
            void setFail(false);
        }
        const fail = () => {
            void setLoading(true);
            if (i + 1 < filteredSources.length) {
                i++;
                set();
            } else if (backup) {
                void setLoading(false);
                void setFail(true);
                void setImage(backup);
            } else {
                void setLoading(false);
                void setFail(true);
            }
        }
        if (loading && updates !== snapshot)
            void set();

        void imgObject.addEventListener("load", event);
        void imgObject.addEventListener("error", fail);

        return () => {
            void imgObject.removeEventListener("load", event);
            void imgObject.removeEventListener("error", fail);
        };
    }, [imgObject, filteredSources, backup, updates, loading, snapshot]);


    return {
        src: image, fail, loading, retry: () => {
            retry(updates + 1);
            setLoading(true);
        }
    };
}