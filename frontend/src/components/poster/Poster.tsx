import React, { useEffect } from "react";
import useRipple from "use-ripple-hook";
import useImage from "../../hooks/useImage";
import { MangaInfo } from "../../types";
import classes from "./poster.module.scss";

type Props = {
    manga?: MangaInfo;
};

export default function Poster({ manga }: Props) {
    const [ripple, event] = useRipple();
    const {
        src: image,
        loading,
        fail,
        retry,
    } = useImage([manga?.cover], "https://i.imgur.com/SIyOAeP.png");

    useEffect(() => {
        retry();
    }, [manga]);

    return (
        <>
            <button className={classes.poster} ref={ripple} onMouseDown={event}>
                <div
                    className={classes.posterImage}
                    style={{
                        backgroundImage: `url("${image}")`,
                    }}
                >
                    {loading && <div className={classes.loader}></div>}
                </div>
            </button>
        </>
    );
}
