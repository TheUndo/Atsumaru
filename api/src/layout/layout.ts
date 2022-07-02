export type LayoutItem = {
  key: string;
  type: "SHOWCASE" | "CAROUSEL";
  fetch: string;
};

export type CarouselLayoutItem = LayoutItem & {
  title: string;
  type: "CAROUSEL";
};

export type ShowcaseLayoutItem = LayoutItem & {
  type: "SHOWCASE";
};

type Items = CarouselLayoutItem | ShowcaseLayoutItem;

export function createLayout(
  items: (Items | undefined | null | boolean | number)[],
): Items[] {
  return items.filter(v => v) as Items[];
}