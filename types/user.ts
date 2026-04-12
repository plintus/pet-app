import { Pet } from "./pet";

export type StoredUser = {
  name: string;
  pets: Pet[];
};

export type UsersMap = Record<string, StoredUser>;
