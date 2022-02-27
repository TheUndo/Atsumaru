import React, { Props, useContext } from "react";
import { AppContext } from "../../../../App";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import { Setting, RadioSetting } from "../../Settings";

export default function PageProgressIndicator() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  return (
    <>
      <Setting label="Page indicator">
        <RadioSetting
          currentValue={settings.displayCurrentPageIndicator}
          onChange={(value: SettingsType["displayCurrentPageIndicator"]) =>
            void setSetting("displayCurrentPageIndicator", value)
          }
          items={[
            {
              value: "ON-FOCUS",
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
                  Summon
                </Button>
              ),
            },
            {
              value: "ALWAYS",
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
                  Always
                </Button>
              ),
            },
            {
              value: "NEVER",
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
                  Never
                </Button>
              ),
            },
          ]}
        ></RadioSetting>
      </Setting>
    </>
  );
}
