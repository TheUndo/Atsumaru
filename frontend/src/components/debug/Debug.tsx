import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AppContext } from "../../appContext";
import { apiBase } from "../../hooks/useApi";
import isDev from "../../utils/isDev";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import SettingsDebugger from "./SettingsDebugger";
/* import classes from "./debug.module.scss"; */

export default function Debug() {
  const debug = isDev();
  const ctx = useContext(AppContext);
  const [loggedIn, setLoggedIn] = ctx.loggedIn ?? [];
  const [shown, setShown] = useState(false);
  const { isLoading, data, error, refetch } = useQuery(
    ["logout"],
    () =>
      fetch(`${apiBase}/auth/logout`, {
        credentials: "include",
      })
        .then(res => res.json())
        .then(d => {
          if (d === "ok") {
            console.log("logged out");
            setLoggedIn?.(false);
            return d;
          } else throw "error";
        }),
    {
      enabled: false,
    },
  );

  if (!debug) return <></>;
  return (
    <>
      <Header level={1}>
        Welcome to Atsumaru development!{" "}
        <Button
          onClick={() => setShown(!shown)}
          icon={
            <Icon icon="chevron" orientation={shown ? "-.25turn" : ".25turn"} />
          }
        />
      </Header>
      {location.host !== "localhost:4000" && (
        <div>
          <a href="http://localhost:4000" target="_blanc">
            <Button icon={<Icon icon="external" />}>View built frontend</Button>
          </a>
        </div>
      )}

      {shown && (
        <>
          <p>
            You're seeing this message because you're running Atsumaru locally.
          </p>
          {loggedIn && (
            <>
              <hr />
              <Button loading={isLoading} onClick={() => refetch()}>
                {isLoading
                  ? "Signing you out..."
                  : error
                  ? "error"
                  : data
                  ? "done."
                  : "Sign out"}
              </Button>
            </>
          )}
          <hr /> <SettingsDebugger />
        </>
      )}
      <hr />
    </>
  );
}
