import React, { useContext } from "react";
import { AppContext } from "../../../../appContext";
import { SettingsType } from "../../../../hooks/useSettings";
import Button from "../../../button/Button";
import RadioCircle from "../../radioCircle/RadioCircle";
import { Setting } from "../../Settings";

export default function KeyboardControls() {
  const [settings, setSetting] = useContext(AppContext)?.settings!;

  return (
    <Setting label="Keyboard controls" desktop dropdown>
      <Button
        style={{ marginBottom: ".5rem" }}
        fullWidth
        icon={
          <RadioCircle
            checkbox
            active={settings.readerKeyboardNavigation?.disabled === "YES"}
          />
        }
        onClick={() =>
          setSetting?.(
            "readerKeyboardNavigation.disabled",
            settings.readerKeyboardNavigation?.disabled === "YES"
              ? "NO"
              : "YES",
          )
        }>
        Disable all
      </Button>
      <Button
        style={{ marginBottom: ".5rem" }}
        fullWidth
        disabled={settings.readerKeyboardNavigation?.disabled === "YES"}
        icon={
          <RadioCircle
            checkbox
            active={
              settings.readerKeyboardNavigation?.disabled === "NO" &&
              settings.readerKeyboardNavigation?.wasd === "YES"
            }
          />
        }
        onClick={() =>
          setSetting?.(
            "readerKeyboardNavigation.wasd",
            settings.readerKeyboardNavigation?.wasd === "YES" ? "NO" : "YES",
          )
        }
        css={{
          boxSizing: "border-box",
          border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
        }}>
        WASD
      </Button>
      <Button
        style={{ marginBottom: ".5rem" }}
        fullWidth
        disabled={settings.readerKeyboardNavigation?.disabled === "YES"}
        icon={
          <RadioCircle
            checkbox
            active={
              settings.readerKeyboardNavigation?.disabled === "NO" &&
              settings.readerKeyboardNavigation?.arrowKeys === "YES"
            }
          />
        }
        onClick={() =>
          setSetting?.(
            "readerKeyboardNavigation.arrowKeys",
            settings.readerKeyboardNavigation?.arrowKeys === "YES"
              ? "NO"
              : "YES",
          )
        }
        css={{
          boxSizing: "border-box",
          border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
        }}>
        Arrow keys
      </Button>
      <Button
        style={{ marginBottom: ".5rem" }}
        fullWidth
        disabled={settings.readerKeyboardNavigation?.disabled === "YES"}
        icon={
          <RadioCircle
            checkbox
            active={
              settings.readerKeyboardNavigation?.disabled === "NO" &&
              settings.readerKeyboardNavigation?.nextPage === "YES"
            }
          />
        }
        onClick={() =>
          setSetting?.(
            "readerKeyboardNavigation.nextPage",
            settings.readerKeyboardNavigation?.nextPage === "YES"
              ? "NO"
              : "YES",
          )
        }
        css={{
          boxSizing: "border-box",
          border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
        }}>
        Next chapter (N)
      </Button>
      <Button
        style={{ marginBottom: ".5rem" }}
        fullWidth
        disabled={settings.readerKeyboardNavigation?.disabled === "YES"}
        icon={
          <RadioCircle
            checkbox
            active={
              settings.readerKeyboardNavigation?.disabled === "NO" &&
              settings.readerKeyboardNavigation?.previousPage === "YES"
            }
          />
        }
        onClick={() =>
          setSetting?.(
            "readerKeyboardNavigation.previousPage",
            settings.readerKeyboardNavigation?.previousPage === "YES"
              ? "NO"
              : "YES",
          )
        }
        css={{
          boxSizing: "border-box",
          border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
        }}>
        Previous chapter (P)
      </Button>
      <Button
        style={{ marginBottom: ".5rem" }}
        fullWidth
        disabled={settings.readerKeyboardNavigation?.disabled === "YES"}
        onClick={() => {
          const options = ["NEXT-PAGE", "NEXT-CHAPTER", "DISABLED"];
          const index = options.indexOf(
            settings.readerKeyboardNavigation?.spacebar,
          );
          const toSet = options[index + 1] ?? options[0];

          setSetting?.("readerKeyboardNavigation.spacebar", toSet);
        }}
        css={{
          boxSizing: "border-box",
          border: `2px solid ${true ? "var(--accent)" : "transparent"}`,
        }}>
        Space bar:{" "}
        {settings.readerKeyboardNavigation?.spacebar === "DISABLED"
          ? "Disabled"
          : settings.readerKeyboardNavigation?.spacebar === "NEXT-CHAPTER"
          ? "Next chapter"
          : "Next page"}
      </Button>
    </Setting>
  );
}
