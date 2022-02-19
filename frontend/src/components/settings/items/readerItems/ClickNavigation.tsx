import React, { useContext } from "react";
import { AppContext } from "../../../../App";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import RadioCircle from "../../radioCircle/RadioCircle";
import { Setting, RadioSetting } from "../../Settings";

export default function ClickNavigation() {
    const [settings, setSetting] = useContext(AppContext)?.settings!;

    return (
        <>
            <Setting label="Click behavior" desktop>
                <Button
                    style={{ marginBottom: ".5rem" }}
                    fullWidth
                    icon={
                        <RadioCircle
                            checkbox
                            active={
                                settings.readerClickNavigationDisabled === "YES"
                            }
                        />
                    }
                    onClick={() =>
                        setSetting?.(
                            "readerClickNavigationDisabled",
                            settings.readerClickNavigationDisabled === "YES"
                                ? "NO"
                                : "YES"
                        )
                    }
                    css={{
                        boxSizing: "border-box",
                        border: `2px solid ${
                            true ? "var(--accent)" : "transparent"
                        }`,
                    }}
                >
                    Disabled
                </Button>
                <RadioSetting
                    currentValue={settings.readerClickNavigation}
                    onChange={(value: SettingsType["readerClickNavigation"]) =>
                        void setSetting("readerClickNavigation", value)
                    }
                    vertical
                    items={[
                        {
                            value: "PREV-MENU-NEXT",
                            content: (active: boolean) => (
                                <Button
                                    disabled={
                                        settings.readerClickNavigationDisabled ===
                                        "YES"
                                    }
                                    fullWidth
                                    icon={<RadioCircle active={active} />}
                                    css={{
                                        boxSizing: "border-box",
                                        border: `2px solid ${
                                            active
                                                ? "var(--accent)"
                                                : "transparent"
                                        }`,
                                    }}
                                >
                                    <Flex>
                                        {settings.readingDirection ===
                                        "RIGHT-TO-LEFT" ? (
                                            <>
                                                {" "}
                                                <FlexItem>Next</FlexItem>
                                                <div>|</div>
                                                <FlexItem>Menu</FlexItem>
                                                <div>|</div>
                                                <FlexItem>Prev</FlexItem>
                                            </>
                                        ) : (
                                            <>
                                                {" "}
                                                <FlexItem>Prev</FlexItem>
                                                <div>|</div>
                                                <FlexItem>Menu</FlexItem>
                                                <div>|</div>
                                                <FlexItem>Next</FlexItem>
                                            </>
                                        )}
                                    </Flex>
                                </Button>
                            ),
                        },
                        {
                            value: "PREV-NEXT",
                            content: (active: boolean) => (
                                <Button
                                    disabled={
                                        settings.readerClickNavigationDisabled ===
                                        "YES"
                                    }
                                    fullWidth
                                    icon={<RadioCircle active={active} />}
                                    css={{
                                        boxSizing: "border-box",
                                        border: `2px solid ${
                                            active
                                                ? "var(--accent)"
                                                : "transparent"
                                        }`,
                                    }}
                                >
                                    <Flex>
                                    {settings.readingDirection ===
                                        "RIGHT-TO-LEFT" ? (
                                            <>
                                                {" "}
                                                <FlexItem>Next</FlexItem>
                                                <div>|</div>
                                                <FlexItem>Prev</FlexItem>
                                            </>
                                        ) : (
                                            <>
                                                {" "}
                                                <FlexItem>Prev</FlexItem>
                                                <div>|</div>
                                                <FlexItem>Next</FlexItem>
                                            </>
                                        )}
                                    </Flex>
                                </Button>
                            ),
                        },
                        {
                            value: "ONLY-NEXT",
                            content: (active: boolean) => (
                                <Button
                                    disabled={
                                        settings.readerClickNavigationDisabled ===
                                        "YES"
                                    }
                                    fullWidth
                                    icon={<RadioCircle active={active} />}
                                    css={{
                                        boxSizing: "border-box",
                                        border: `2px solid ${
                                            active
                                                ? "var(--accent)"
                                                : "transparent"
                                        }`,
                                    }}
                                >
                                    <Flex>
                                        <FlexItem>Next</FlexItem>
                                    </Flex>
                                </Button>
                            ),
                        },
                    ]}
                ></RadioSetting>
            </Setting>
        </>
    );
}

function Flex({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                }}
            >
                {children}
            </div>
        </>
    );
}
function FlexItem({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div
                style={{
                    flex: "1",
                    textAlign: "center",
                }}
            >
                {children}
            </div>
        </>
    );
}
