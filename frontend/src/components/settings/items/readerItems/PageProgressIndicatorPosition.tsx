import React, { useContext } from "react";
import { AppContext } from "../../../../appContext";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import Icon from "../../../icon/Icon";
import { Setting, RadioSetting } from "../../Settings";

export default function PageProgressIndicatorPosition() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  return settings.displayCurrentPageIndicator !== "NEVER" ? (
    <Setting label="Page progress indicator position" mobile>
      <RadioSetting
        currentValue={settings.currentPageIndicatorLocation}
        onChange={(value: SettingsType["currentPageIndicatorLocation"]) =>
          void setSetting("currentPageIndicatorLocation", value)
        }
        items={[
          {
            value: "LEFT",
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
                icon={<Icon icon="arrowWall" orientation="-.5turn" />}
                legend="Left"
              />
            ),
          },
          {
            value: "CENTER",
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
                icon={<Icon icon="biDirectional" />}
                legend="Centered"
              />
            ),
          },
          {
            value: "RIGHT",
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
                icon={<Icon icon="arrowWall" />}
                legend="Right"
              />
            ),
          },
        ]}></RadioSetting>
    </Setting>
  ) : (
    <></>
  );
}
