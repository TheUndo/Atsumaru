import React, { useContext } from "react";
import { useMatch } from "react-router-dom";
import { AppContext } from "../../App";
import cm from "../../utils/classMerger";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import { items, NavbarItemType } from "../navbar/Navbar";
import classes from "./desktopNavbar.module.scss";

function DesktopNavbar() {
    const { desktopNavbar } = useContext(AppContext);

    return (
        <>
            <div
                className={cm(
                    classes.navbar,
                    !desktopNavbar?.[0] && classes.hidden
                )}
            >
                <div className={classes.inner}>
                    <div className={classes.items}>
                        {items.map((item, i) => (
                            <Item key={i + item.legend} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function Item({ item }: { item: NavbarItemType }) {
    const match = useMatch(item.to);

    return (
        <>
            <div className={classes.item}>
                <div className={classes.itemInner}>
                    <Button
                        icon={(match && item.activeIcon) || item.icon}
                        fullWidth
                        to={item.to}
                        style={
                            match
                                ? {
                                      color: "var(--accent)",
                                  }
                                : {}
                        }
                    >
                        {item.legend}
                        <div
                            className={cm(
                                classes.active,
                                !match && classes.hidden
                            )}
                        ></div>
                    </Button>
                </div>
            </div>
        </>
    );
}

export function BurgerButton() {
    const [desktopNavbarShown, setDesktopShown] = useContext(AppContext)
        ?.desktopNavbar ?? [true];
    return (
        <Button
            className={cm(
                classes.burger,
                desktopNavbarShown && classes.navShown
            )}
            circle
            onClick={() => setDesktopShown?.(!desktopNavbarShown)}
            icon={
                desktopNavbarShown ? (
                    <Icon
                        icon="close"
                        style={{
                            transform: "scale(1.05)",
                        }}
                    />
                ) : (
                    <Icon
                        style={{
                            transform: "scaleY(.9)",
                        }}
                        icon="burger"
                    />
                )
            }
        />
    );
}

export default React.memo(DesktopNavbar);
