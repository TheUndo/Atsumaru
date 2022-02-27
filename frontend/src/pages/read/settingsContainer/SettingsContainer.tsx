import React from "react";
import Button from "../../../components/button/Button";
import Header from "../../../components/header/Header";
import Icon from "../../../components/icon/Icon";
import Settings from "../../../components/settings/Settings";
import cm from "../../../utils/classMerger";
import FloatingControls from "../floatingControls/FloatingControls";
import { ReaderContext } from "../Reader";
import classes from "./settingsContainer.module.scss";
import controlsClasses from "../floatingControls/floatingControls.module.scss";

type Props = {};

export default function SettingsContainer() {
  return (
    <>
      <ReaderContext.Consumer>
        {({ settingsShown, setSettingsShown }) => (
          <div
            className={cm(
              classes.settings,
              settingsShown && classes.settingsShown
            )}
          >
            <div className={classes.background}>
              <div className={classes.backgroundInner}></div>
            </div>
            <div className={classes.settingsInner}>
              <FloatingControls>
                <div
                  className={cm(
                    controlsClasses.floatingControlCollection,
                    controlsClasses.floatEnd
                  )}
                >
                  <div className={controlsClasses.floatingControl}>
                    <Button
                      className={cm("reader-control-button")}
                      onClick={() => {
                        setSettingsShown(false);
                      }}
                      icon={<Icon icon="close" />}
                    ></Button>
                  </div>
                </div>
              </FloatingControls>
              <div className={classes.settingsContent}>
                <Header level={1}>Settings</Header>
                <Settings />
              </div>
            </div>
          </div>
        )}
      </ReaderContext.Consumer>
    </>
  );
}
