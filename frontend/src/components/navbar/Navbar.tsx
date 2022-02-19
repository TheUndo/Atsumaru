import React from "react";
import { useMatch } from "react-router-dom";
import cm from "../../utils/classMerger";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import classes from "./navbar.module.scss";

type Props = {
    children?: React.ReactNode | React.ReactNode[];
};
export type NavbarItemType = {
    to: string;
    legend: string;
    icon: JSX.Element;
    activeIcon?: JSX.Element;
};

export const items: NavbarItemType[] = [
    {
        to: "/",
        legend: "Home",
        icon: <Icon icon="home" />,
        activeIcon: <Icon icon="homeSolid" />,
    },
    {
        to: "/search",
        legend: "Search",
        icon: <Icon icon="search" />,
    },
    {
        to: "/library",
        legend: "Your library",
        icon: <Icon icon="yourLibrary" />,
    },
    {
        to: "/profile",
        legend: "Profile",
        icon: <Icon icon="user" />,
        activeIcon: <Icon icon="userSolid" />,
    },
];

export default function Navbar(props: Props) {
    const match = useMatch("/read/:vendor/:mangaSlug/:chapter/:page");

    return (
        <>
            <div className={cm(classes.navbar, !!match && classes.hidden)}>
                <div className={classes.inner}>
                    {items.map((item) => (
                        <NavbarItem item={item} key={item.legend} />
                    ))}
                </div>
            </div>
        </>
    );
}

function NavbarItem({ item }: { item: NavbarItemType }) {
    const match = useMatch(item.to);

    return (
        <>
            <div className={cm(classes.item, match && classes.active)}>
                <Button
                    icon={(!!match && item.activeIcon) || item.icon}
                    legend={item.legend}
                    to={item.to}
                ></Button>
            </div>
        </>
    );
}
