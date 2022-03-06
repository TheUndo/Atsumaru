import React from "react";

type Props = {
  col?: string | string[] | [number, string];
  row?: string | string[] | [number, string];
  children: React.ReactNode | React.ReactNode[];
  gap?: string;
  rowGap?: string;
  colGap?: string;
};

export default function Grid({
  col,
  row,
  children,
  rowGap,
  colGap,
  gap,
}: Props) {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: (() => {
            if (typeof col === "string") return col;
            else if (col?.[0]) return `repeat(${col[0]}, ${col[1]})`;
            else if (col) return col.join(" ");
            return "unset";
          })(),
          gridTemplateRows: (() => {
            if (typeof row === "string") return row;
            else if (row?.[0]) return `repeat(${row[0]}, ${row[1]})`;
            else if (row) return row.join(" ");
            return "unset";
          })(),
          rowGap,
          columnGap: colGap,
          gap,
        }}>
        {children}
      </div>
    </>
  );
}
