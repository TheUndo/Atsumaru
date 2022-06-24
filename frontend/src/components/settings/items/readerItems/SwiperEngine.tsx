import React, { useContext } from "react";
import { AppContext } from "../../../../appContext";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import Icon from "../../../icon/Icon";
import { Setting, RadioSetting } from "../../Settings";
import StripWidthControl from "../StripWidthControl";

export default function PageFillMethod() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  if (settings.readingDirection === "TOP-TO-BOTTOM") return <></>;

  return (
    <Setting mobile label="Page render engine">
      <RadioSetting
        currentValue={settings.readerSwipeEngine}
        onChange={(value: SettingsType["readerSwipeEngine"]) =>
          void setSetting("readerSwipeEngine", value)
        }
        items={[
          {
            value: "NATIVE",

            content: (active: boolean) => (
              <Button
                fullWidth
                css={
                  active
                    ? {
                        background: "var(--accent)",
                      }
                    : null
                }
                legend="Native"
                icon={<Icon icon="chrome" />}
              />
            ),
          },
          {
            value: "CUSTOM",

            content: (active: boolean) => (
              <Button
                fullWidth
                css={
                  active
                    ? {
                        background: "var(--accent)",
                      }
                    : null
                }
                legend="Atsu!"
                icon={<Icon icon="android" />}
              />
            ),
          },
        ]}></RadioSetting>
    </Setting>
  );
}
