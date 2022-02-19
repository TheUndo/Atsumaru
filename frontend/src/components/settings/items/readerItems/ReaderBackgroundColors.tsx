import React, { Props, useContext } from "react";
import { AppContext } from "../../../../App";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import { Setting, RadioSetting } from "../../Settings";
import classes from "../../settings.module.scss";

export default function ReaderBackgroundColor() {
    const [settings, setSetting] = useContext(AppContext)?.settings!;

    return (
        <>
            <Setting label="Reader background color">
                <RadioSetting
                    currentValue={settings.readerBackgroundColor}
                    onChange={(value: SettingsType["readerBackgroundColor"]) =>
                        void setSetting("readerBackgroundColor", value)
                    }
                    items={[
                        {
                            value: "#000000",
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
                                    Black
                                </Button>
                            ),
                        },
                        {
                            value: "#111",
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
                                    Gray
                                </Button>
                            ),
                        },
                        {
                            value: "#ffffff",
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
                                    White
                                </Button>
                            ),
                        },
                        {
                            value: "custom",
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
                                    Custom
                                </Button>
                            ),
                        },
                    ]}
                ></RadioSetting>
                {settings.readerBackgroundColor === "custom" && (
                    <div className={classes.colorPicker}>
                        Pick a custom color
                        <input
                            type="color"
                            defaultValue={settings.readerCustomBackgroundColor}
                            onChange={(e) => {
                                clearTimeout(
                                    (window as any).__settingsDebounceColor
                                );
                                (window as any).__settingsDebounceColor =
                                    setTimeout(() => {
                                        setSetting(
                                            "readerCustomBackgroundColor",
                                            e.target.value
                                        );
                                    }, 10);
                            }}
                        />
                    </div>
                )}
            </Setting>
        </>
    );
}
