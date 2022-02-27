import React from "react";
import Icon from "../../../components/icon/Icon";
import cm from "../../../utils/classMerger";
import { clamp } from "../../../utils/utils";
import classes from "./nextChapterIndicator.module.scss";

type Props = {};

export default function NextChapterIndicator({
  color,
  scaling,
  prev,
}: {
  color: string;
  scaling: number;
  prev?: boolean;
}) {
  return (
    <>
      <div
        className={cm(
          classes.nextChapterIndicator,
          prev
            ? classes.nextChapterIndicatorPrevious
            : classes.nextChapterIndicatorNext
        )}
        style={{
          transform: `translateY(calc(-50% - 11px)) ${
            prev ? "rotateY(180deg) translateX(100%) " : ""
          }scaleX(${clamp(0, scaling / 100, 1)})`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 640 560"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          <path
            d="M639.999996,-0.000002c-2.196407,1.34023,2.551684,0,0,0-142.113143,0-216.494831,71.802682-292.315621,100.724015C233.412685,144.312184,132.68867,120.07927,132.68867,253.282609s102.491104,120.161984,202.626089,141.956069s162.572094,84.76132,304.685238,84.76132"
            transform="translate(2 75)"
            fill={color}
            stroke={color}
            strokeWidth="0"
          />
        </svg>
        <Icon icon="arrow" orientation=".25turn" />
      </div>
    </>
  );
}
