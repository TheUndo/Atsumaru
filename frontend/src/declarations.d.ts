declare module "*.module.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "virtual:pwa-register/react" {
  // @ts-ignore ignore when react is not installed
  import { Dispatch, SetStateAction } from "react";

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>];
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
