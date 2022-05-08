import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AppContext } from "../../App";
import { apiBase } from "../../hooks/useApi";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import SettingsDebugger from "./SettingsDebugger";
/* import classes from "./debug.module.scss"; */

export default function Debug() {
  const debug = ["localhost", "local.com", "atsumaru.local"].includes(
    location.hostname,
  );
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

      {shown && (
        <>
          <p>
            You're seeing this message because you're running Atsumaru locally.
          </p>
          {loggedIn && (
            <>
              <hr />
              <Button onClick={() => refetch()}>
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
function query(query: any) {
  throw new Error("Function not implemented.");
}
