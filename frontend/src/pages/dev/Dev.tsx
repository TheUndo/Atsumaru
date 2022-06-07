import React, { useState } from "react";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import MangaLink from "../../components/MangaLink/MangaLink";
import PosterGrid from "../../components/posterGrid/PosterGrid";
import Switcher from "../../components/switcher/Switcher";
import classes from "./dev.module.scss";

type Props = {};

export default function Dev(props: Props) {
  const [selected, setSelected] = useState("test");

  return (
    <>
      <div>
        <Header level={1}>Show manga page</Header>
        <Button onClick={() => {}}>YEP</Button>
        <Header level={1}>Switcher</Header>
        <Switcher
          items={[
            {
              value: "test",
              content: (forwardRef, props) => (
                <Button transparent forwardRef={forwardRef} {...props}>
                  sup dude?
                </Button>
              ),
            },
            {
              value: "test2",
              content: (forwardRef, props) => (
                <Button
                  icon={<Icon icon="home" />}
                  transparent
                  forwardRef={forwardRef}
                  {...props}>
                  sup dude?
                </Button>
              ),
            },
            {
              value: "test3",
              content: (forwardRef, props) => (
                <Button transparent forwardRef={forwardRef} {...props}>
                  YEP
                </Button>
              ),
            },
          ]}
          onChange={setSelected}
          selected={selected}
        />
        <div>Selected: {selected}</div>

        <div>
          <PosterGrid>
            <MangaLink to="/manga/s1/atsu-atsu-trattoria">
              <Button compact>To manga</Button>
            </MangaLink>
          </PosterGrid>
        </div>
      </div>
    </>
  );
}
