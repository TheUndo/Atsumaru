import React, { useState } from "react";
import ASExample from "../../components/atsuSwipe/ASExample";
import Button from "../../components/button/Button";
import Dropdown from "../../components/dropdown/Dropdown";
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
        <ASExample />
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
        <div style={{height: "500px"}}></div>


        <div>
          <Dropdown
            button={
              <Button
                iconLoc="right"
                icon={<Icon icon="chevron" orientation=".25turn" />}>
                Dropdown
              </Button>
            }
            items={[...Array(100)].map((v, i) => ({
              value: "test" + i,
              content: <Button fullWidth>Option {i + 1}</Button>,
            }))}
          />
        </div>
        <br />
        <div style={{height: "1000px"}}></div>
      </div>
    </>
  );
}
