import React, { useContext } from "react";
import { AppContext } from "../../../App";
import { SettingsType } from "../../../hooks/useSettings";
import Button from "../../button/Button";
import Icon from "../../icon/Icon";
import { RadioSetting, Setting } from "../Settings";
import StripWidth from "./readerItems/StripWidth";

interface Props {
  children?: React.ReactNode;
}

function StripWidthControl(props: Props) {
  const [settings, setSetting] = useContext(AppContext)?.settings!;
  return (
    <>
      <Setting label="Strip width">
        <RadioSetting
          currentValue={settings.stripWidthControl}
          onChange={(value: SettingsType["stripWidthControl"]) =>
            void setSetting("stripWidthControl", value)
          }
          vertical
          items={[
            {
              value: "AUTO",
              content: (active: boolean) => (
                <Button
                  fullWidth
                  icon={<Icon icon="bolt" />}
                  css={
                    active
                      ? {
                          background: "var(--accent)",
                        }
                      : {
                          opacity: 0.8,
                        }
                  }
                >
                  Auto
                </Button>
              ),
            },
            {
              value: "MANUAL",
              content: (active: boolean) => (
                <Button
                  css={
                    active
                      ? {
                          outline: "2px solid var(--accent)",
                        }
                      : {
                          opacity: 0.8,
                        }
                  }
                  fullWidth
                >
                  <StripWidth active={active} />
                </Button>
              ),
            },
          ]}
        />
      </Setting>
    </>
  );
}

export default React.memo(StripWidthControl);
