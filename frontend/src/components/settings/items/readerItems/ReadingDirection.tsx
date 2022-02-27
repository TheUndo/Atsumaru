import React, { useContext } from "react";
import { AppContext } from "../../../../App";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import Icon from "../../../icon/Icon";
import { Setting, RadioSetting } from "../../Settings";

export default function ReadingDirection() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  return (
    <>
      <Setting label="Reading direction">
        <RadioSetting
          currentValue={settings.readingDirection}
          onChange={(value: SettingsType["readingDirection"]) =>
            void setSetting("readingDirection", value)
          }
          items={[
            {
              value: "RIGHT-TO-LEFT",
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
                  legend="Right to left"
                  icon={<Icon icon="arrow" orientation="-.25turn" />}
                />
              ),
            },
            {
              value: "TOP-TO-BOTTOM",
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
                  legend="Top to bottom"
                  icon={<Icon icon="arrow" orientation=".5turn" />}
                />
              ),
            },
            {
              value: "LEFT-TO-RIGHT",
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
                  legend="Left to right"
                  icon={<Icon icon="arrow" orientation=".25turn" />}
                />
              ),
            },
          ]}
        ></RadioSetting>
      </Setting>
    </>
  );
}
