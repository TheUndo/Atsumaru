import React from "react";
import classes from "./loading.module.scss";

export default function Loading() {
    return (
        <>
            <div className={classes.loading}>
                <div className={classes.loader}>
                    <svg>
                        <defs>
                            <filter id="goo">
                                <feGaussianBlur
                                    in="SourceGraphic"
                                    stdDeviation="2"
                                    result="blur"
                                />
                                <feColorMatrix
                                    in="blur"
                                    mode="matrix"
                                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2"
                                    result="gooey"
                                />
                                <feComposite
                                    in="SourceGraphic"
                                    in2="gooey"
                                    operator="atop"
                                />
                            </filter>
                        </defs>
                    </svg>
                </div>
            </div>
        </>
    );
}

export function LoadingPage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className={classes.page}>{children}</div>
        </>
    );
}
