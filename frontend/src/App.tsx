import React, { useCallback, useEffect, useState } from "react";
import dom from "react-dom";
import { RecoilRoot } from "recoil";
import {
  BrowserRouter,
  Routes,
  Route,
  useMatch,
  useLocation,
} from "react-router-dom";
import Front from "./pages/front/Front";
import "./global.css";
import E404 from "./pages/e404/E404";
import Reader from "./pages/read/Reader";
import useSettings from "./hooks/useSettings";
import { downloadFile } from "./offline/downloadFile";
import { BurgerButton } from "./components/desktopNavbar/DesktopNavbar";
import Layout, { GenericPage } from "./components/layout/Layout";
import Signup from "./components/signup/Signup";
import Search from "./pages/search/Search";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import ReactDOM from "react-dom/client";
import Dev from "./pages/dev/Dev";
import { AppContext, User } from "./appContext";
import Contribute from "./pages/contribute/Contribute";
import UnderConstruction from "./pages/underConstruction/UnderConstruction";
import { registerSW } from "virtual:pwa-register";
import isDev from "./utils/isDev";
import { useUserInfo } from "./state/user";

if ("serviceWorker" in navigator && !isDev()) {
  navigator.serviceWorker.register("/sw.js");

  navigator.serviceWorker.ready.then(sw => {
    /* navigator.serviceWorker.controller?.postMessage({
      type: "CACHE_IMAGE",
      src: "https://scans-ongoing-2.planeptune.us/manga/Yuusha-Shoutai-Kamoku-Yuusha-Wa/0001-001.png",
    }); */
  });
}

/* downloadFile(
    "https://scans-ongoing-2.planeptune.us/manga/Yuusha-Shoutai-Kamoku-Yuusha-Wa/0001-001.png"
); */

const queryClient = new QueryClient();

const info = (
  <Route path="/manga/:vendor/:mangaSlug" element={<></>}>
    <Route path="chapters" element={<></>} />
  </Route>
);

function App() {
  const searchMatch = useMatch("/search/:query");
  const settings = useSettings();
  const [loggedIn, setLoggedIn] = useState<User | false>(false);
  const desktopNavbarState = settings[0].desktopSideMenuOpen === "YES";
  const searchQuery = useState(searchMatch?.params?.query ?? "");
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  const setDesktopNavbarState = useCallback(
    (value: boolean) => {
      settings[1]("desktopSideMenuOpen", value ? "YES" : "NO");
    },
    [settings[1]],
  );
  const signIn = useState(false);
  const value: AppContext = {
    settings,
    desktopNavbar: [desktopNavbarState, setDesktopNavbarState] as const,
    signIn,
    loggedIn: [loggedIn, setLoggedIn],
    searchQuery,
  };

  useEffect(() => {
    const q = searchMatch?.params.query;
    if (q) {
      searchQuery[1](q);
    }
  }, [searchMatch]);

  const me = useUserInfo<User>({});

  useEffect(() => {
    if (me.data) setLoggedIn(me.data);
  }, [me]);

  return (
    <>
      <AppContext.Provider value={value}>
        <RecoilRoot>
          <BurgerButton />
          <Signup />
          <Search />
          <Layout>
            <Routes location={state?.backgroundLocation || location}>
              <Route
                path="/read/:vendor/:readSlug/:chapter/:page"
                element={<Reader />}
              />

              {isDev() && (
                <Route
                  path="/dev"
                  element={
                    <GenericPage>
                      <Dev />
                    </GenericPage>
                  }></Route>
              )}
              <Route
                path="/"
                element={
                  <GenericPage>
                    <Front />
                  </GenericPage>
                }>
                {info}
                <Route path="/ouath/anilist" element={<Signup />} />
                <Route path="/search/:query" element={<></>} />
              </Route>
              <Route
                path="/contribute"
                element={
                  <GenericPage>
                    <Contribute />
                  </GenericPage>
                }
              />
              <Route
                path="/explore"
                element={
                  <GenericPage>
                    <UnderConstruction />
                  </GenericPage>
                }
              />
              <Route
                path="*"
                element={
                  <GenericPage>
                    <E404 />
                  </GenericPage>
                }
              />
            </Routes>
            {state?.backgroundLocation && (
              <Routes>
                <Route path="/manga/:vendor/:mangaSlug" element={<></>}>
                  <Route path="chapters" element={<></>} />
                </Route>
              </Routes>
            )}
          </Layout>
        </RecoilRoot>
      </AppContext.Provider>
    </>
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
