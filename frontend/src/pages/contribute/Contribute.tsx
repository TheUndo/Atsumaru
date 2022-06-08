import React from "react";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import classes from "./contribute.module.scss";

type Props = {};

export default function Contribute(props: Props) {
  return (
    <>
      <div className={classes.contribute}>
        <Header level={1}>Contribute to Atsumaru</Header>
        <p>Hi there, thanks for stopping by!</p>
        <p>
          Atsumaru is an ambitious open source manga reader designed to give you
          the best manga reading experience on every device.
        </p>
        <p>
          Even though we work very hard to maintain and update Atsumaru, at the
          end of the day, it's still a hobby project and does not pay the bills.
          Nevertheless we're fully committed to keep Atsumaru running!
        </p>
        <p>
          That's why we would love your help. We appreciate any form of
          contribution whether that be a bug report, art contributions or even a
          new feature that would improve the app. Feel free to stop by our{" "}
          <a target="_blank" href="https://discord.gg/Tj4QmEF4uV">
            Discord
          </a>{" "}
          server and discuss ideas or ask for help! Or just contribute directly
          with a PR on our{" "}
          <a target="_blank" href="https://github.com/TheUndo/Atsumaru">
            repo
          </a>
          .
        </p>
        <p>
          <strong>Are you a developer?</strong> We're in need of development of
          any form. If you're experienced with TypeScript/JavaScript and
          interested in contributing or know someone who is, contact{" "}
          <a
            target="_blank"
            href="https://discord.com/channels/@me/246660882803720193">
            Undo#7742 on Discord
          </a>
          !
        </p>
        <p className={classes.small}>
          Thanks for using Atsumaru!
          <br />
          <span className={classes.tab}></span>- Undo, Lead developer
        </p>
        <Button icon={<Icon icon="home" />} to="/">
          OK, cool
        </Button>
      </div>
    </>
  );
}
