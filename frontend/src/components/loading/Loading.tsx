import React from "react";
import cm from "../../utils/classMerger";
import classes from "./loading.module.scss";

export default function Loading() {
  return (
    <>
      <div className={classes.cont}>
        <div className={classes.wrap}>
          <div className={classes.loading}>
            <div className={cm(classes.loader, "loader")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                preserveAspectRatio="xMidYMid">
                <path
                  d="M24 50A26 26 0 0 0 76 50A26 26.6 0 0 1 24 50"
                  fill="currentColor"
                  stroke="none">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="1s"
                    repeatCount="indefinite"
                    keyTimes="0;1"
                    values="0 50 50.3;360 50 50.3"></animateTransform>
                </path>
              </svg>
            </div>
          </div>
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

/*
old loader

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
        <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
    </defs>
</svg>
*/
