import React, { useState } from "react";
import { MangaInfo, Anilist } from "../../../../types";
import Switcher from "../../../switcher/Switcher";
import Label from "../label/Label";
import switcherItem from "../switcherItem/SwitcherItem";

export default function Desc({
  data,
  anilist,
}: {
  data: MangaInfo;
  anilist?: Anilist;
}) {
  type Options = "ORIGINAL" | "ANILIST";
  const [description, setDescription] = useState<Options>("ORIGINAL");

  return (
    <>
      {anilist &&
        anilist.data.description?.replace(/^\s+|\s+$/g, "") !==
          data.description && (
          <>
            <Label>Description source</Label>
            <Switcher
              variant="dark"
              selected={description}
              onChange={setDescription}
              items={[
                switcherItem<Options>("ORIGINAL", "Original"),
                switcherItem<Options>("ANILIST", "Anilist"),
              ]}
            />
          </>
        )}
      <p>
        {anilist ? (
          description === "ANILIST" ? (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  anilist.data.description?.replace(/^\s+|\s+$/g, "") ||
                  "<i>No anilist synopsis available</i>",
              }}></div>
          ) : (
            data?.description
          )
        ) : (
          data?.description
        )}
      </p>
    </>
  );
}
