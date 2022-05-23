import { useCallback, useState } from "react";
import { tryJSONParse } from "../utils/utils";

const key = "__manga_useSettings_v1"; // update this if settings change

export type SettingsType = {
  readingDirection: "LEFT-TO-RIGHT" | "RIGHT-TO-LEFT" | "TOP-TO-BOTTOM";
  imageFitMethod: "TO-SCREEN" | "TO-WIDTH" | "TO-HEIGHT";
  stripWidthControl: "AUTO" | "MANUAL";
  stripWidth: string;
  readerBackgroundColor: "#000000" | "#111" | "#ffffff" | "custom";
  readerCustomBackgroundColor: string;
  readerButtonsAppearance: "SOLID" | "HOLLOW" | "TRANSPARENT";
  displayCurrentPageIndicator: "ON-FOCUS" | "ALWAYS" | "NEVER";
  currentPageIndicatorLocation: "LEFT" | "CENTER" | "RIGHT";
  pagesModifyColors: "NONE" | "DARKEN" | "INVERT" | "WARM";
  tapToNavigate: "NO" | "YES";
  displayChapterNavigation: "ON-FOCUS" | "ALWAYS";
  readerKeyboardNavigation: {
    disabled: "NO" | "YES";
    wasd: "YES" | "NO";
    arrowKeys: "YES" | "NO";
    nextPage: "YES" | "NO";
    previousPage: "YES" | "NO"; // wrongly named page, please fix
    spacebar: "NEXT-PAGE" | "NEXT-CHAPTER" | "DISABLED";
  };
  readerShowDesktopDrawer: "YES" | "NO";
  readerClickNavigationDisabled: "NO" | "YES";
  readerClickNavigation: "PREV-MENU-NEXT" | "PREV-NEXT" | "ONLY-NEXT";
  desktopSideMenuOpen: "NO" | "YES";
};

const defaultSettings: SettingsType = {
  readingDirection: "LEFT-TO-RIGHT",
  imageFitMethod: "TO-SCREEN",
  stripWidthControl: "AUTO",
  stripWidth: "100%",
  readerBackgroundColor: "#000000",
  readerCustomBackgroundColor: "#000000",
  readerButtonsAppearance: "SOLID",
  displayCurrentPageIndicator: "ON-FOCUS",
  currentPageIndicatorLocation: "CENTER",
  pagesModifyColors: "NONE",
  tapToNavigate: "NO",
  displayChapterNavigation: "ON-FOCUS",
  readerKeyboardNavigation: {
    disabled: "NO",
    wasd: "YES",
    arrowKeys: "YES",
    nextPage: "YES",
    previousPage: "YES",
    spacebar: "NEXT-PAGE",
  },
  readerShowDesktopDrawer: "YES",
  readerClickNavigationDisabled: "NO",
  readerClickNavigation: "PREV-MENU-NEXT",
  desktopSideMenuOpen: "NO",
};

export default function useSettings() {
  const [settings, setSettings] = useState<SettingsType>(getCachedSettings());
  const [snapshot, update] = useState(0);
  const setSetting = useCallback(
    (keys: string, value: any) => {
      const snapshot = Date.now();
      void updateDeep(settings, value, keys); // With reference!
      void update(snapshot);
      void setSettings(prevState => ({
        ...prevState,
        ...settings,
      }));
      void cacheSettings(settings);
    },
    [update, settings, setSettings],
  );

  return [settings, setSetting] as const;
}

function getCachedSettings(): SettingsType {
  const cached = tryJSONParse<SettingsType>(localStorage.getItem(key));

  return cached || defaultSettings;
}

function cacheSettings(settings: SettingsType) {
  return void localStorage.setItem(key, JSON.stringify(settings));
}

/** https://stackoverflow.com/a/6842900/13188385 */
function updateDeep(obj: any, value: any, path: any) {
  var i;
  path = path.split(".");
  for (i = 0; i < path.length - 1; i++) if (obj[path[i]]) obj = obj[path[i]];

  obj[path[i]] = value;
}
