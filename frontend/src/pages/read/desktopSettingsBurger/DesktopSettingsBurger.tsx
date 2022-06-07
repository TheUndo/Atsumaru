import React, { useContext } from "react";
import { AppContext } from "../../../appContext";
import Button from "../../../components/button/Button";
import Icon from "../../../components/icon/Icon";
import classes from "./desktopSettingsBurger.module.scss";

type Props = {};

export default function DesktopSettingsBurger() {
  const [, setSetting] = useContext(AppContext).settings ?? [];

  return (
    <>
      <div className={classes.desktopSettingsBurger}>
        <Button
          onClick={() => setSetting?.("readerShowDesktopDrawer", "YES")}
          circle
          icon={<Icon icon="settings" />}
        />
      </div>
    </>
  );
}
