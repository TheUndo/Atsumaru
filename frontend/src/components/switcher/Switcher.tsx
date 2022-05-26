import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cm from "../../utils/classMerger";
import Button from "../button/Button";
import classes from "./switcher.module.scss";

type Item<T> = {
  value: T;
  content: (
    forwardRef: React.RefObject<HTMLElement>,
    props: {
      onClick: () => void;
      className: string;
    },
  ) => React.ReactNode;
};

type Props<T> = {
  items: Item<T>[];
  selected?: T | null;
  onChange?: (selected: T) => void;
};

export default function Switcher<T extends string | number>({
  items,
  selected,
  onChange,
}: Props<T>) {
  const [itemsMap, setItemsMap] = useState(
    new Map<T, React.RefObject<HTMLElement>>(),
  );

  const getStyles = useCallback(() => {
    const item = selected && itemsMap.get(selected);
    if (item?.current) {
      const styles = window.getComputedStyle(item.current);

      return {
        borderRadius: styles.borderRadius,
        height: item.current.offsetHeight + "px",
        left: item.current.offsetLeft + "px",
        top: item.current.offsetTop + "px",
        width: item.current.offsetWidth + "px",
      };
    }
  }, [selected, itemsMap]);
  const [style, setStyle] = useState<ReturnType<typeof getStyles>>(getStyles());

  useEffect(() => {
    const handler = () => {
      setStyle(getStyles());
    };
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [selected, itemsMap]);

  return (
    <>
      <div className={classes.switcher}>
        <div style={style ?? getStyles()} className={classes.active}></div>
        {items.map(item => (
          <SwitcherItem<T>
            item={item}
            register={setItemsMap}
            key={item.value}
            selected={selected}
            dispatch={onChange}
          />
        ))}
      </div>
    </>
  );
}

function SwitcherItem<T>({
  item,
  register,
  selected,
  dispatch,
}: {
  item: Item<T>;
  register: React.Dispatch<
    React.SetStateAction<Map<T, React.RefObject<HTMLElement>>>
  >;
  selected: Props<T>["selected"];
  dispatch: Props<T>["onChange"];
}) {
  const forwardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    register(prev => {
      prev.set(item.value, forwardRef);
      return prev;
    });
  }, [forwardRef, item]);

  const active = useMemo(() => selected === item.value, [selected, item]);

  return (
    <>
      <div>
        {item.content(forwardRef, {
          onClick: () => {
            if (item.value) dispatch?.(item.value);
          },
          className: cm(classes.item, active && classes.activeItem),
        })}
      </div>
    </>
  );
}
