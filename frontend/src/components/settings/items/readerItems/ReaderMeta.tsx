import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../App";
import { SettingsType } from "../../../../hooks/useSettings";
import getBattery from "../../../../utils/battery";
import Button from "../../../button/Button";
import RadioCircle from "../../radioCircle/RadioCircle";
import { Setting, RadioSetting } from "../../Settings";

export default function KeyboardControls() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;
  const [hasBattery, setHasBattery] = useState(false);

  useEffect(() => {
    getBattery().then(() => setHasBattery(true));
  }, []);

  return (
    <>
      <Setting label="Status bar" dropdown>
        <Button
          style={{ marginBottom: ".5rem" }}
          fullWidth
          icon={
            <RadioCircle
              checkbox
              active={settings.readerMeta?.disabled === "YES"}
            />
          }
          onClick={() =>
            setSetting?.(
              "readerMeta.disabled",
              settings.readerMeta?.disabled === "YES" ? "NO" : "YES",
            )
          }
          css={{
            boxSizing: "border-box",
            border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
          }}>
          Hidden
        </Button>
        <Button
          style={{ marginBottom: ".5rem" }}
          fullWidth
          disabled={settings.readerMeta?.disabled === "YES"}
          icon={
            <RadioCircle
              checkbox
              active={
                settings.readerMeta?.disabled === "NO" &&
                settings.readerMeta?.chapter === "YES"
              }
            />
          }
          onClick={() =>
            setSetting?.(
              "readerMeta.chapter",
              settings.readerMeta?.chapter === "YES" ? "NO" : "YES",
            )
          }
          css={{
            boxSizing: "border-box",
            border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
          }}>
          Chapter
        </Button>
        <Button
          style={{ marginBottom: ".5rem" }}
          fullWidth
          disabled={settings.readerMeta?.disabled === "YES"}
          icon={
            <RadioCircle
              checkbox
              active={
                settings.readerMeta?.disabled === "NO" &&
                settings.readerMeta?.page === "YES"
              }
            />
          }
          onClick={() =>
            setSetting?.(
              "readerMeta.page",
              settings.readerMeta?.page === "YES" ? "NO" : "YES",
            )
          }
          css={{
            boxSizing: "border-box",
            border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
          }}>
          Page
        </Button>
        <Button
          style={{ marginBottom: ".5rem" }}
          fullWidth
          disabled={settings.readerMeta?.disabled === "YES"}
          icon={
            <RadioCircle
              checkbox
              active={
                settings.readerMeta?.disabled === "NO" &&
                settings.readerMeta?.time === "YES"
              }
            />
          }
          onClick={() =>
            setSetting?.(
              "readerMeta.time",
              settings.readerMeta?.time === "YES" ? "NO" : "YES",
            )
          }
          css={{
            boxSizing: "border-box",
            border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
          }}>
          Time
        </Button>
        <Button
          style={{ marginBottom: ".5rem" }}
          fullWidth
          disabled={settings.readerMeta?.disabled === "YES" || !hasBattery}
          icon={
            <RadioCircle
              checkbox
              active={
                settings.readerMeta?.disabled === "NO" &&
                settings.readerMeta?.battery === "YES" &&
                hasBattery
              }
            />
          }
          onClick={() =>
            setSetting?.(
              "readerMeta.battery",
              settings.readerMeta?.battery === "YES" ? "NO" : "YES",
            )
          }
          css={{
            boxSizing: "border-box",
            border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
          }}>
          Battery
        </Button>
        <Button
          style={{ marginBottom: ".5rem" }}
          fullWidth
          disabled={settings.readerMeta?.disabled === "YES"}
          icon={
            <RadioCircle
              checkbox
              active={
                settings.readerMeta?.disabled === "NO" &&
                settings.readerMeta?.labels === "YES"
              }
            />
          }
          onClick={() =>
            setSetting?.(
              "readerMeta.labels",
              settings.readerMeta?.labels === "YES" ? "NO" : "YES",
            )
          }
          css={{
            boxSizing: "border-box",
            border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
          }}>
          Labels
        </Button>
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
        }}>
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
        }}>
        {children}
      </div>
    </>
  );
}
