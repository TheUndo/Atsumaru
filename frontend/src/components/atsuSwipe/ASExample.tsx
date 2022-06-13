import React from "react";
import AtsuSwipe from "./AtsuSwipe";

type Props = {};

export default function ASExample(props: Props) {
  return (
    <>
      <AtsuSwipe
        pages={[...Array(10)].map((_, i) => ({
          key: i + "",
          content: <div>page {i + 1}</div>,
        }))}
      />
    </>
  );
}
