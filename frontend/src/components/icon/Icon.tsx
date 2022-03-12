import React from "react";
import cm from "../../utils/classMerger";
import classes from "./icon.module.scss";
import icons from "./icons";

type Props = {
  icon: keyof typeof icons;
  orientation?: string;
  scale?: number;
} & React.ComponentProps<"div">;

export default function Icon(props: Props) {
  const { icon, orientation, scale, ...compProps } = props;
  return (
    <>
      <div
        {...compProps}
        className={cm(classes.icon, "icon")}
        style={{
          transform: `rotateZ(${orientation ?? "0turn"}) scale(${
            scale ?? "1"
          })`,
          ...(compProps.style ?? {}),
        }}>
        {icons[icon]}
      </div>
    </>
  );
}
