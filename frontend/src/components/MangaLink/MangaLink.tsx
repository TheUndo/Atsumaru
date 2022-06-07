import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  PropsWithChildren,
} from "react";
import { Link, useLocation } from "react-router-dom";

type Props = ComponentPropsWithoutRef<typeof Link>;

export default forwardRef(function MangaLink(
  masterProps: Props,
  ref: React.Ref<HTMLAnchorElement>,
) {
  const { children, ...compProps } = masterProps;
  const location = useLocation();

  return (
    <>
      <Link
        ref={ref}
        state={{
          backgroundLocation:
            (location.state as any)?.backgroundLocation || location,
        }}
        {...compProps}>
        {children}
      </Link>
    </>
  );
});
