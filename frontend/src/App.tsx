import React, { createContext, useCallback, useEffect, useState } from "react";
import dom from "react-dom";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Front from "./pages/front/Front";
import "./global.css";
import E404 from "./pages/e404/E404";
import Reader from "./pages/read/Reader";
import useSettings, { SettingsType } from "./hooks/useSettings";
import { downloadFile } from "./offline/downloadFile";
import { BurgerButton } from "./components/desktopNavbar/DesktopNavbar";
import Layout, { GenericPage } from "./components/layout/Layout";
import Signup from "./components/signup/Signup";
import Button from "./components/button/Button";
/* import { registerSW } from "virtual:pwa-register"; */

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");

  navigator.serviceWorker.ready.then(sw => {
    navigator.serviceWorker.controller?.postMessage({
      type: "CACHE_IMAGE",
      src: "https://scans-ongoing-2.planeptune.us/manga/Yuusha-Shoutai-Kamoku-Yuusha-Wa/0001-001.png",
    });
  });
}

/* downloadFile(
    "https://scans-ongoing-2.planeptune.us/manga/Yuusha-Shoutai-Kamoku-Yuusha-Wa/0001-001.png"
); */

export type AppContext = {
  settings?: readonly [SettingsType, (keys: string, value: any) => void];
  desktopNavbar?: readonly [boolean, (value: boolean) => void];
  signIn?: [boolean, (value: boolean) => void];
};

export const AppContext = createContext<AppContext>({});

export const AuthContext = createContext<{}>({});

function App() {
  const settings = useSettings();
  const desktopNavbarState = settings[0].desktopSideMenuOpen === "YES";
  const setDesktopNavbarState = useCallback(
    (value: boolean) => {
      settings[1]("desktopSideMenuOpen", value ? "YES" : "NO");
    },
    [settings[1]],
  );
  const signIn = useState(false);
  const value = {
    settings,
    desktopNavbar: [desktopNavbarState, setDesktopNavbarState] as const,
    signIn,
  };

  useEffect(() => {
    document.body.addEventListener("scroll", async () => {
      await new Promise(resolve => window.requestAnimationFrame(resolve));
      const { scrollTop, scrollLeft, scrollHeight, clientHeight } =
        document.body;
      const atTop = scrollTop === 0;
      const beforeTop = 1;
      const atBottom = scrollTop === scrollHeight - clientHeight;
      const beforeBottom = scrollHeight - clientHeight - 1;

      if (atTop) {
        document.body.scrollTo(scrollLeft, beforeTop);
      } else if (atBottom) {
        document.body.scrollTo(scrollLeft, beforeBottom);
      }
    });
  }, []);

  return (
    <>
      <React.StrictMode>
        <AppContext.Provider value={value}>
          <RecoilRoot>
            <BrowserRouter>
              <BurgerButton />
              <Signup />
              <Layout>
                <Routes>
                  <Route
                    path="/read/:vendor/:readSlug/:chapter/:page"
                    element={<Reader />}></Route>
                  <Route
                    path="/"
                    element={
                      <GenericPage>
                        <Front />
                      </GenericPage>
                    }>
                    <Route path="/manga/:vendor/:mangaSlug" element={<></>}>
                      <Route path="chapters" element={<></>} />
                    </Route>
                  </Route>
                  <Route
                    path="/search"
                    element={
                      <GenericPage>
                        <Test />
                      </GenericPage>
                    }></Route>
                  <Route
                    path="*"
                    element={
                      <GenericPage>
                        <E404 />
                      </GenericPage>
                    }
                  />
                </Routes>
              </Layout>
            </BrowserRouter>
          </RecoilRoot>
        </AppContext.Provider>
      </React.StrictMode>
    </>
  );
}

function Test() {
  const navigate = useNavigate();

  return <Button onClick={() => navigate("/")}>test</Button>;
}

dom.render(<App />, document.getElementById("root"));
