import React, { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import Content from "./Content";
import Modal from "../modal/Modal";
import Chapters from "./Chapters";
import useApi, { apiBase } from "../../hooks/useApi";
import { MangaInfo, ProgressInfo } from "../../types";
import { useQuery } from "react-query";

export type MangaEndPointResponse = {
  manga: MangaInfo;
  progress?: ProgressInfo;
};

export default function Info() {
  const match = useMatch(`/manga/:vendor/:mangaSlug`);
  const { vendor, mangaSlug } = match?.params ?? {};
  const layout = {
    current: document.getElementById("freeContent") as HTMLDivElement,
  };

  return (
    <>
      <ShowModal
        vendor={vendor as MangaInfo["vendor"]}
        layout={layout}
        slug={mangaSlug}
      />
      <ChapterModal layout={layout} />
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
  const apiData = useQuery<MangaEndPointResponse>(
    ["mangaInfo", vendor, slug],
    () =>
      fetch(`${apiBase}/manga/${vendor}/${slug}`, {
        credentials: "include",
      }).then(d => d.json()),
    {
      enabled: !!slug,
    },
  );

  useEffect(() => {
    const handler = () => {
      apiData.refetch();
    };
    window.addEventListener("progressSync", handler);
    return () => window.removeEventListener("progressSync", handler);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Modal
        shown={!!slug}
        scaleElements={[layout.current]}
        onClose={() => {
          console.log("hi");
          navigate(
            (location.state as any)?.backgroundLocation?.pathname ?? "/",
          );
        }}
        id="info-modal">
        <Content slug={slug} apiData={apiData} />
      </Modal>
    </>
  );
}

const ChapterModal = ({
  layout,
}: {
  layout: React.RefObject<HTMLDivElement>;
}) => {
  const navigate = useNavigate();
  const match = useMatch(`/manga/:vendor/:mangaSlug/chapters`);
  const { vendor, mangaSlug } = match?.params ?? {};
  const apiData = useApi<MangaEndPointResponse>(
    `/manga/${vendor}/${mangaSlug}`,
  );
  const location = useLocation();

  return (
    <Modal
      scaleElements={[document.getElementById("info-modal")]}
      shown={!!match}
      onClose={() =>
        navigate(`/manga/${vendor}/${mangaSlug}`, {
          state: location.state,
        })
      }>
      {mangaSlug && (
        <Chapters
          vendor={vendor as MangaInfo["vendor"]}
          slug={mangaSlug}
          chapters={apiData?.data?.manga?.chapters}
          progress={apiData?.data?.progress}
        />
      )}
    </Modal>
  );
};
