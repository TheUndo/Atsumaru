import React from "react";
import Header from "../header/Header";
import SettingsDebugger from "./SettingsDebugger";
/* import classes from "./debug.module.scss"; */

export default function Debug() {
    const debug = ["localhost", "local.com", "atsumaru.local"].includes(
        location.hostname
    );
    if (!debug) return <></>;
    return (
        <>
            <Header level={1}>Welcome to Atsumaru development!</Header>
            <p>
                You're seeing this message because you're running Atsumaru
                locally.
            </p>
            <hr />
            <SettingsDebugger />
            <hr />
        </>
    );
}
