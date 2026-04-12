import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pet } from "../types/pet";
import { StoredUser, UsersMap } from "../types/user";

const USERS_KEY = "pet-app-users";
const CURRENT_USER_KEY = "pet-app-current-user";

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

async function getAllUsers(): Promise<UsersMap> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error("Error reading users:", error);
    return {};
  }
}

async function saveAllUsers(users: UsersMap): Promise<void> {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

export async function signInOrCreateUser(name: string): Promise<StoredUser> {
  const trimmedName = name.trim();
  const userKey = normalizeName(trimmedName);

  if (!trimmedName) {
    throw new Error("Name is required");
  }

  const users = await getAllUsers();

  if (!users[userKey]) {
    users[userKey] = {
      name: trimmedName,
      pets: [],
    };
    await saveAllUsers(users);
  }

  await AsyncStorage.setItem(CURRENT_USER_KEY, userKey);

  return users[userKey];
}

export async function getCurrentUser(): Promise<StoredUser | null> {
  const currentUserKey = await AsyncStorage.getItem(CURRENT_USER_KEY);

  if (!currentUserKey) {
    return null;
  }

  const users = await getAllUsers();
  return users[currentUserKey] ?? null;
}

async function getCurrentUserKey(): Promise<string | null> {
  return AsyncStorage.getItem(CURRENT_USER_KEY);
}

export async function clearCurrentUser(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function getCurrentUserPets(): Promise<Pet[]> {
  const user = await getCurrentUser();
  return user?.pets ?? [];
}

export async function getPetByIdForCurrentUser(
  id: string,
): Promise<Pet | undefined> {
  const pets = await getCurrentUserPets();
  return pets.find((pet) => pet.id === id);
}

export async function addPetForCurrentUser(newPet: Pet): Promise<void> {
  const currentUserKey = await getCurrentUserKey();
  if (!currentUserKey) {
    throw new Error("No current user");
  }

  const users = await getAllUsers();
  const user = users[currentUserKey];

  if (!user) {
    throw new Error("Current user not found");
  }

  user.pets.push(newPet);
  users[currentUserKey] = user;

  await saveAllUsers(users);
}

export async function updatePetForCurrentUser(updatedPet: Pet): Promise<void> {
  const currentUserKey = await getCurrentUserKey();
  if (!currentUserKey) {
    throw new Error("No current user");
  }

  const users = await getAllUsers();
  const user = users[currentUserKey];

  if (!user) {
    throw new Error("Current user not found");
  }

  user.pets = user.pets.map((pet) =>
    pet.id === updatedPet.id ? updatedPet : pet,
  );

  users[currentUserKey] = user;
  await saveAllUsers(users);
}

export async function deletePetForCurrentUser(id: string): Promise<void> {
  const currentUserKey = await getCurrentUserKey();
  if (!currentUserKey) {
    throw new Error("No current user");
  }

  const users = await getAllUsers();
  const user = users[currentUserKey];

  if (!user) {
    throw new Error("Current user not found");
  }

  user.pets = user.pets.filter((pet) => pet.id !== id);

  users[currentUserKey] = user;
  await saveAllUsers(users);
}
