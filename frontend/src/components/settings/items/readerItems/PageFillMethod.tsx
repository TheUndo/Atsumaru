import React, { Props, useContext } from "react";
import { AppContext } from "../../../../App";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import Icon from "../../../icon/Icon";
import { Setting, RadioSetting } from "../../Settings";
import StripWidthControl from "../StripWidthControl";

export default function PageFillMethod() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  return settings.readingDirection !== "TOP-TO-BOTTOM" ? (
    <Setting label="Page fill method">
      <RadioSetting
        currentValue={settings.imageFitMethod}
        onChange={(value: SettingsType["imageFitMethod"]) =>
          void setSetting("imageFitMethod", value)
        }
        items={[
          {
            value: "TO-SCREEN",
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
                legend="To screen"
                icon={
                  <Icon
                    icon="omniDirectional"
                    orientation="calc(.25turn / 2)"
                  />
                }
              />
            ),
          },
          {
            value: "TO-WIDTH",

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
                legend="To width"
                icon={<Icon icon="biDirectional" />}
              />
            ),
          },
          {
            value: "TO-HEIGHT",

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
                legend="To height"
                icon={<Icon icon="biDirectional" orientation=".25turn" />}
              />
            ),
          },
        ]}
      ></RadioSetting>
    </Setting>
  ) : (
    <StripWidthControl />
  );
}
