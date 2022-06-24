import React, { useContext } from "react";
import { AppContext } from "../../../../appContext";
import Button from "../../../button/Button";
import RadioCircle from "../../radioCircle/RadioCircle";
import { Setting } from "../../Settings";

type Props = {};

export default function MobileClickNavigation(props: Props) {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  return (
    <Setting label="Navigation" mobile>
      <Button
        fullWidth
        icon={
          <RadioCircle
            checkbox
            active={settings.readerMobileClickNavigation === "YES"}
          />
        }
        onClick={() =>
          setSetting?.(
            "readerMobileClickNavigation",
            settings.readerMobileClickNavigation === "YES" ? "NO" : "YES",
          )
        }>
        Tap to navigate
      </Button>
    </Setting>
  );
}
