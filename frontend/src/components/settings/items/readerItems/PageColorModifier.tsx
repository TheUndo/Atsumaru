import React, { useContext } from "react";
import { AppContext } from "../../../../appContext";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import { Setting, RadioSetting } from "../../Settings";

export default function PageColorModifier() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  return (
    <>
      <Setting label="Page color modifier">
        <RadioSetting
          currentValue={settings.pagesModifyColors}
          onChange={(value: SettingsType["pagesModifyColors"]) =>
            void setSetting("pagesModifyColors", value)
          }
          items={[
            {
              value: "NONE",
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
                  None
                </Button>
              ),
            },
            {
              value: "WARM",
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
                  Warm
                </Button>
              ),
            },
            {
              value: "DARKEN",
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
                  Darken
                </Button>
              ),
            },
            {
              value: "INVERT",
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
                  Invert
                </Button>
              ),
            },
          ]}
        ></RadioSetting>
      </Setting>
    </>
  );
}
