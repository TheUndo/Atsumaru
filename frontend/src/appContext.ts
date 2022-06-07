import { createContext } from "react";
import { SettingsType } from "./hooks/useSettings";

export type AppContext = {
  settings?: readonly [SettingsType, (keys: string, value: any) => void];
  desktopNavbar?: readonly [boolean, (value: boolean) => void];
  signIn?: [boolean, (value: boolean) => void];
  loggedIn?: [false | User, React.Dispatch<React.SetStateAction<false | User>>];
  searchQuery?: [string, React.Dispatch<React.SetStateAction<string>>];
};
export type UserContext = {
  user?: [
    User | undefined,
    React.Dispatch<React.SetStateAction<User | undefined>>,
  ];
};

export type User = {
  name: string;
  id: number;
  avatar?: {
    large: string;
    medium: string;
  };
};

export const AppContext = createContext<AppContext>({});
