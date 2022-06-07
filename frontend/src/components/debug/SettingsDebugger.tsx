import React, { useContext } from "react";
import { AppContext } from "../../appContext";
import Header from "../header/Header";
/* import classes from "./myComponent.module.scss"; */

type Props = {};

export default function SettingsDebugger(props: Props) {
  const [settings] = useContext(AppContext).settings ?? [{}];
  return (
    <>
      <div>
        <Header level={3}>Settings</Header>
        <pre>{JSON.stringify(settings, null, 4)}</pre>
      </div>
    </>
  );
}
