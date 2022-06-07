import React, { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";

type Props = PropsWithChildren<{ to: string }>;

export default function MangaLink({ to, children }: Props) {
  const location = useLocation();

  return (
    <>
      <Link state={{ backgroundLocation: location }} to={to}>
        {children}
      </Link>
    </>
  );
}
