import React, { useState } from "react";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import SettingsDebugger from "./SettingsDebugger";
/* import classes from "./debug.module.scss"; */

export default function Debug() {
  const debug = ["localhost", "local.com", "atsumaru.local"].includes(
    location.hostname,
  );
  const [shown, setShown] = useState(false);

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
          <hr /> <SettingsDebugger />
        </>
      )}
      <hr />
    </>
  );
}
