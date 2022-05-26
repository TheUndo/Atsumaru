import React, { useContext } from "react";
import { useMatch } from "react-router-dom";
import { AppContext } from "../../App";
import cm from "../../utils/classMerger";
import isDev from "../../utils/isDev";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import classes from "./navbar.module.scss";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
};
export type NavbarItemType = (ctx?: AppContext) => {
  to?: string;
  onClick?: () => void;
  legend: string;
  icon: JSX.Element;
  activeIcon?: JSX.Element;
};

export const items: NavbarItemType[] = [
  () => ({
    to: "/",
    legend: "Home",
    icon: <Icon icon="home" />,
    activeIcon: <Icon icon="homeSolid" />,
  }),
  () => ({
    to: "/search",
    legend: "Search",
    icon: <Icon icon="search" />,
  }),
  () => ({
    to: "/library",
    legend: "Your library",
    icon: <Icon icon="yourLibrary" />,
  }),
  ...(isDev()
    ? [
        () => ({
          to: "/dev",
          legend: "Dev",
          icon: <Icon icon="bracketsCurly" />,
        }),
      ]
    : []),
  (ctx?: AppContext) =>
    ctx?.loggedIn?.[0]
      ? {
          /* to: "/profile", */
          onClick: () => {},
          legend: ctx.loggedIn[0].name,
          icon: <Icon icon="user" />,
          activeIcon: <Icon icon="userSolid" />,
        }
      : {
          /* to: "/profile", */
          onClick: () => {
            console.log("hi");
            ctx?.signIn?.[1](true);
          },
          legend: "Sign in",
          icon: <Icon icon="user" />,
          activeIcon: <Icon icon="userSolid" />,
        },
];

export default function Navbar(props: Props) {
  const match = useMatch("/read/:vendor/:mangaSlug/:chapter/:page");
  const ctx = useContext(AppContext);
  return (
    <>
      <div className={cm(classes.navbar, !!match && classes.hidden)}>
        <div className={classes.inner}>
          {items.map(item => (
            <NavbarItem item={item(ctx)} key={item(ctx).legend} />
          ))}
        </div>
      </div>
    </>
  );
}

function NavbarItem({ item }: { item: ReturnType<NavbarItemType> }) {
  const match = item.to ? useMatch(item.to) : false;

  return (
    <>
      <div
        onClick={item.onClick}
        className={cm(classes.item, match && classes.active)}>
        <Button
          to={item.to}
          icon={(!!match && item.activeIcon) || item.icon}
          legend={item.legend}
        />
      </div>
    </>
  );
}
