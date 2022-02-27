import { MangaInfo } from "../types";

export default function resolveVendorSlug(vendor: MangaInfo["vendor"]) {
  return ((v) => {
    switch (v) {
      case "MANGASEE":
        return "s1";
    }
  })(vendor);
}
