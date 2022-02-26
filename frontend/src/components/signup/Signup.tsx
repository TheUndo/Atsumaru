import React from "react";
import Modal from "../modal/Modal";
import classes from "./signup.module.scss";

type Props = {};

export default function Signup(props: Props) {
    return (
        <>
            <Modal onClose={() => void 0} shown={false}>
                <div className={classes.signup}>hi</div>
            </Modal>
        </>
    );
}
