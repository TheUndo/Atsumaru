import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import classes from "./disclaimer.module.scss";

type Props = {};

export default function Disclaimer(props: Props) {
  const [shown, setShown] = useLocalStorage<"YES" | "NO">(
    "beta-disclaimer",
    "YES",
  );
  if (shown === "NO") return <></>;
  return (
    <div className={classes.disclaimer}>
      <Header level={2}>Welcome to Atsumaru!</Header>
      <p>
        We're currently in <strong>beta testing</strong> which means there are
        many unfinished sections.
      </p>
      <p>
        If you find an issue or have a suggestion to improve Atsumaru, don't
        hesitate to bring it up in our{" "}
        <a target="_blank" href="https://discord.gg/Tj4QmEF4uV">
          Discord server
        </a>{" "}
        or{" "}
        <a target="_blank" href="https://github.com/TheUndo/Atsumaru">
          Github
        </a>
        !
      </p>
      <div>
        <Button onClick={() => setShown("NO")} accent>
          Got it!
        </Button>
      </div>
    </div>
  );
}
