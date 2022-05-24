import React, { useContext, useState } from "react";
import useMeasure from "react-use-measure";
import { AppContext } from "../../App";
import cm from "../../utils/classMerger";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import Loading, { LoadingPage } from "../loading/Loading";
import ClickNavigation from "./items/readerItems/ClickNavigation";
import KeyboardControls from "./items/readerItems/KeyboardControls";
import ReaderMeta from "./items/readerItems/ReaderMeta";
import PageColorModifier from "./items/readerItems/PageColorModifier";
import PageFillMethod from "./items/readerItems/PageFillMethod";
import PageProgressIndicator from "./items/readerItems/PageProgressIndicator";
import PageProgressIndicatorPosition from "./items/readerItems/PageProgressIndicatorPosition";
import ReaderBackgroundColor from "./items/readerItems/ReaderBackgroundColors";
import ReaderUIAppearance from "./items/readerItems/ReaderUIAppearance";
import ReadingDirection from "./items/readerItems/ReadingDirection";
import classes from "./settings.module.scss";

export default function Settings() {
  const [settings, setSetting] = useContext(AppContext)?.settings ?? [];

  if (!settings || !setSetting)
    return (
      <>
        <LoadingPage>
          <Loading />
        </LoadingPage>
      </>
    );

  return (
    <>
      <div className={classes.settings}>
        <div className={classes.inner}>
          <ReadingDirection />
          <PageFillMethod />
          <ClickNavigation />
          <KeyboardControls />
          <ReaderMeta />
          <ReaderBackgroundColor />
          <ReaderUIAppearance />
          <PageProgressIndicator />
          <PageProgressIndicatorPosition />
          <PageColorModifier />
        </div>
      </div>
    </>
  );
}

export function Setting({
  children,
  label,
  mobile,
  desktop,
  dropdown,
}: {
  children: React.ReactNode;
  label: React.ReactNode;
  mobile?: boolean;
  desktop?: boolean;
  dropdown?: boolean;
}) {
  return (
    <>
      <div
        className={cm(
          classes.setting,
          mobile && classes.mobile,
          desktop && classes.desktop
        )}
      >
        <div className={classes.settingsInner}>
          {dropdown ? (
            <DropDown label={label}>{children}</DropDown>
          ) : (
            <>
              <div className={classes.settingLabel}>{label}</div>
              <div className={classes.settingContent}>{children}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function DropDown({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  const [hidden, setHidden] = useState(true);
  const [ref, bounds] = useMeasure();

  return (
    <>
      <Button
        onClick={() => setHidden(!hidden)}
        fullWidth
        icon={
          <Icon icon="chevron" orientation={`${hidden ? "" : "-"}.25turn`} />
        }
        iconLoc="right"
      >
        {label}
      </Button>
      <div
        style={{
          height: hidden ? "0" : bounds.height + "px",
        }}
        className={cm(
          classes.dropdownContent,
          hidden && classes.dropdownContentHidden
        )}
      >
        <div ref={ref}>
          <div className={cm(classes.dropdown, hidden && classes.hidden)}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export function RadioSetting<T extends string | number>({
  items,
  onChange,
  currentValue,
  vertical,
}: {
  currentValue: T;
  onChange: (value: T) => void;
  items: {
    value: T;
    content: (active: boolean) => React.ReactNode;
  }[];
  vertical?: boolean;
}) {
  return (
    <>
      <div
        className={cm(
          classes.radioSetting,
          vertical && classes.radioSettingVertical
        )}
      >
        {items.map((item) => (
          <div
            onClick={() => onChange(item.value)}
            className={classes.ratioSettingItem}
            key={item.value}
          >
            {item.content(item.value === currentValue)}
          </div>
        ))}
      </div>
    </>
  );
}
