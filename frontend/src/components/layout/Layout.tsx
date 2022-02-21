import React, {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
} from "react";
import { Outlet, useMatch } from "react-router-dom";
import { AppContext } from "../../App";
import cm from "../../utils/classMerger";
import DesktopNavbar from "../desktopNavbar/DesktopNavbar";
import Navbar from "../navbar/Navbar";
import classes from "./layout.module.scss";

type Props = {
    children: React.ReactNode | React.ReactNode[];
};

export default function Layout(props: Props) {
    const [desktopNavbarShown, setDesktopNavbarShown] = useContext(AppContext)
        ?.desktopNavbar ?? [true];
    const match = useMatch("/read/vendor/:mangaSlug/:chapter/:page");
    useLayoutEffect(() => {
        if (!!match) setDesktopNavbarShown?.(!!match);
    }, [match, setDesktopNavbarShown]);
    return (
        <>
            <main className={classes.layout}>
                <section
                    className={cm(
                        classes.navbar,
                        desktopNavbarShown && classes.shown
                    )}
                >
                    <DesktopNavbar />
                </section>
                <section className={classes.freeContent}>
                    {props.children}
                    <Outlet />
                </section>
                <section className={classes.sidebar}></section>
            </main>
            <Navbar />
        </>
    );
}

export function GenericPage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <section className={classes.content}>{children}</section>
        </>
    );
}
