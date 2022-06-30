import { ComponentProps } from "react";
import Button from "../../../button/Button";
import { SwitcherItemStruct } from "../../../switcher/Switcher";

export default function switcherItem<T>(
  value: T,
  children: React.ReactNode,
  buttonProps?: ComponentProps<typeof Button>,
) {
  return {
    value,
    content: (
      forwardRef: Parameters<SwitcherItemStruct<T>["content"]>[0],
      props: Parameters<SwitcherItemStruct<T>["content"]>[1],
      selected: Parameters<SwitcherItemStruct<T>["content"]>[2],
    ) => (
      <Button
        noHoverEffect
        compact
        transparent
        alignCenter
        forwardRef={forwardRef}
        style={{
          color: value === selected ? "#fff" : "var(--color)",
          fontWeight: "bold",
        }}
        {...buttonProps}
        {...props}>
        {children}
      </Button>
    ),
  };
}
