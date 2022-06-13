import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { AppContext } from "../../appContext";
import cm from "../../utils/classMerger";
import log from "../../utils/log";
import DesktopNavbar from "../desktopNavbar/DesktopNavbar";
import Info from "../info/Info";
import Navbar from "../navbar/Navbar";
import TopBar from "../topBar/TopBar";
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
      <DesktopNavbar />
      <TopBar />
      <main className={classes.layout}>
        <section
          className={cm(
            classes.navbar,
            desktopNavbarShown && classes.shown,
          )}></section>
        <section id="freeContent" className={classes.freeContent}>
          {props.children}
          <Outlet />
        </section>
        <section className={classes.sidebar}></section>
        <Info />
      </main>
      <Navbar />
    </>
  );
}

export function GenericPage({ children }: { children: React.ReactNode }) {
  const location = useLocation().pathname.split("/")[1];

  useEffect(() => {
    if (!["manga"].includes(location)) {
      scrollTo(0, 0);
      log.info(
        `Page switch detected: "/${location}" ... resetting scroll position`,
      );
    }
  }, [location]);
  return (
    <>
      <section className={classes.content}>{children}</section>
    </>
  );
}
