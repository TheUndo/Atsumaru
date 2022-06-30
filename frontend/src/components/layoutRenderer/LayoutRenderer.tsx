import React from "react";
import Carousel, { GenericItem, ShowcaseItem } from "../carousel/Carousel";
import Showcase from "../showcase/Showcase";
import classes from "./layoutRenderer.module.scss";

type Props = {
  layout: (GenericItem | ShowcaseItem)[];
  refetch?: () => void;
  isRefetching?: boolean;
};

export default function LayoutRenderer({
  layout,
  refetch,
  isRefetching,
}: Props) {
  return (
    <>
      {layout.map(item => {
        if (item.type === "carousel")
          return (
            <Carousel
              key={item.key}
              onRefresh={refetch}
              isRefreshing={isRefetching}
              item={item}
            />
          );
        else if (item.type === "showcase")
          return <Showcase key={item.key} layout={item} />;

        return <></>;
      })}
    </>
  );
}
