import React from "react";
import Button from "../../components/button/Button";
import classes from "../../components/disclaimer/disclaimer.module.scss";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
type Props = {};

export default function UnderConstruction(props: Props) {
  return (
    <>
      <div className={classes.disclaimer}>
        <Header level={2}>This page is under construction!</Header>
        <p>
          Atsumaru is in beta and this page is still being created, check back
          soon!
        </p>
        <Button to="/" icon={<Icon icon="home" />} accent>
          Can't wait!
        </Button>
      </div>
    </>
  );
}
