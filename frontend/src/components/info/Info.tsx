import React, { useEffect, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import Content from "./Content";
import Modal from "../modal/Modal";
import Chapters from "./Chapters";
import useApi from "../../hooks/useApi";
import { MangaInfo, ProgressInfo } from "../../types";

export type MangaEndPointResponse = {
  manga: MangaInfo;
  progress?: ProgressInfo;
};

export default function Info({
  layout,
}: {
  layout: React.RefObject<HTMLDivElement>;
}) {
  const { mangaSlug, vendor } = useParams();

  return (
    <>
      <ShowModal
        vendor={vendor as MangaInfo["vendor"]}
        layout={layout}
        slug={mangaSlug}
      />
      <ChapterModal
        vendor={vendor as MangaInfo["vendor"]}
        layout={layout}
        slug={mangaSlug}
      />
    </>
  );
}

function ShowModal({
  slug,
  layout,
  vendor,
}: {
  slug?: string;
  layout: React.RefObject<HTMLDivElement>;
  vendor: MangaInfo["vendor"];
}) {
  //const [shown, setShown] = useState(false);
  const apiData = useApi<MangaEndPointResponse>(`/manga/${vendor}/${slug}`);
  const navigate = useNavigate();

  return (
    <>
      <Modal
        shown={!!slug}
        scaleElements={[layout.current]}
        onClose={() => {
          //setShown(false);
          navigate("/");
        }}
        id="info-modal">
        <Content slug={slug} apiData={apiData} />
      </Modal>
    </>
  );
}

const ChapterModal = React.memo(
  ({
    slug,
    layout,
    vendor,
  }: {
    slug?: string;
    layout: React.RefObject<HTMLDivElement>;
    vendor: MangaInfo["vendor"];
  }) => {
    const navigate = useNavigate();
    const match = useMatch(`/manga/${vendor}/:mangaSlug/chapters`);
    const apiData = useApi<MangaEndPointResponse>(`/manga/${vendor}/${slug}`);

    return (
      <Modal
        scaleElements={[document.getElementById("info-modal")]}
        shown={!!match}
        onClose={() => navigate(`/manga/${vendor}/${slug}`)}>
        {slug && (
          <Chapters
            vendor={vendor}
            slug={slug}
            chapters={apiData?.data?.manga?.chapters}
            progress={apiData?.data?.progress}
          />
        )}
      </Modal>
    );
  },
);
