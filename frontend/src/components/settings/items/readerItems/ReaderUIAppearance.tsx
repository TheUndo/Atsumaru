import React, { Props, useContext } from "react";
import { AppContext } from "../../../../App";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import { Setting, RadioSetting } from "../../Settings";

export default function ReaderUIAppearance() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  return (
    <>
      <Setting label="Reader UI appearance" mobile>
        <RadioSetting
          currentValue={settings.readerButtonsAppearance}
          onChange={(value: SettingsType["readerButtonsAppearance"]) =>
            void setSetting("readerButtonsAppearance", value)
          }
          items={[
            {
              value: "SOLID",
              content: (active: boolean) => (
                <Button
                  fullWidth
                  alignCenter
                  css={
                    active
                      ? {
                          background: "var(--accent)",
                        }
                      : null
                  }
                >
                  Solid
                </Button>
              ),
            },
            {
              value: "HOLLOW",
              content: (active: boolean) => (
                <Button
                  fullWidth
                  alignCenter
                  css={
                    active
                      ? {
                          background: "var(--accent)",
                        }
                      : null
                  }
                >
                  Hollow
                </Button>
              ),
            },
            {
              value: "TRANSPARENT",
              content: (active: boolean) => (
                <Button
                  fullWidth
                  alignCenter
                  css={
                    active
                      ? {
                          background: "var(--accent)",
                        }
                      : null
                  }
                >
                  Transparent
                </Button>
              ),
            },
          ]}
        ></RadioSetting>
      </Setting>
    </>
  );
}
