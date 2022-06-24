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
import { useQuery, UseQueryResult } from "react-query";
import useMedia from "../../hooks/useMedia";
import DesktopManga from "../desktopManga/DesktopManga";
import { useMangaInfo } from "../../state/mangaInfo";

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
  const [cache, setCache] =
    useState<UseQueryResult<MangaEndPointResponse, unknown>>();
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
    if (slug) {
      if (
        slug === apiData.data?.manga.slug &&
        cache?.data?.manga.slug !== slug
      ) {
        setCache(apiData);
      }
    }
  }, [slug, apiData]);

  useEffect(() => {
    const handler = () => {
      apiData.refetch();
    };
    window.addEventListener("progressSync", handler);
    return () => window.removeEventListener("progressSync", handler);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const media = "(max-width: 1000px)";
  const mobile = useMedia([media], [true], window.matchMedia(media).matches);

  return (
    <>
      {mobile ? (
        <Modal
          shown={!!slug}
          scaleElements={[layout.current]}
          onClose={() => {
            navigate(
              (location.state as any)?.backgroundLocation?.pathname ?? "/",
            );
          }}
          id="info-modal">
          <Content slug={slug} apiData={apiData} />
        </Modal>
      ) : (
        <DesktopManga
          slug={slug}
          apiData={
            slug === cache?.data?.manga.slug ? cache ?? apiData : apiData
          }
        />
      )}
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

  const apiData = useMangaInfo<MangaEndPointResponse>(
    {
      enabled: !!mangaSlug && !!vendor,
    },
    vendor as MangaInfo["vendor"],
    mangaSlug!,
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
      {mangaSlug && apiData?.data?.manga?.chapters && (
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
