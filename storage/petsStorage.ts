import AsyncStorage from "@react-native-async-storage/async-storage";
import { Allergy, Medication, Pet, Vaccine } from "../types/pet";

const PETS_KEY = "pets";

type NewVaccine = Omit<Vaccine, "id"> | Vaccine;
type NewAllergy = Omit<Allergy, "id"> | Allergy;
type NewMedication = Omit<Medication, "id"> | Medication;

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getPets(): Promise<Pet[]> {
  try {
    const data = await AsyncStorage.getItem(PETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading pets:", error);
    return [];
  }
}

export async function savePets(pets: Pet[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
  } catch (error) {
    console.error("Error saving pets:", error);
  }
}

export async function addPet(newPet: Pet): Promise<void> {
  const pets = await getPets();
  await savePets([...pets, newPet]);
}

export async function updatePet(updatedPet: Pet): Promise<void> {
  const pets = await getPets();
  const updatedPets = pets.map((pet) =>
    pet.id === updatedPet.id ? updatedPet : pet,
  );
  await savePets(updatedPets);
}

export async function deletePet(id: string): Promise<void> {
  const pets = await getPets();
  const filteredPets = pets.filter((pet) => pet.id !== id);
  await savePets(filteredPets);
}

export async function getPetById(id: string): Promise<Pet | undefined> {
  const pets = await getPets();
  return pets.find((pet) => pet.id === id);
}

export function addVaccineToPet(pet: Pet, vaccine: NewVaccine): Pet {
  const vaccineToAdd: Vaccine =
    "id" in vaccine ? vaccine : { id: createId(), ...vaccine };

  return {
    ...pet,
    vaccines: [...pet.vaccines, vaccineToAdd],
  };
}

export function updateVaccineOnPet(pet: Pet, updatedVaccine: Vaccine): Pet {
  return {
    ...pet,
    vaccines: pet.vaccines.map((vaccine) =>
      vaccine.id === updatedVaccine.id ? updatedVaccine : vaccine,
    ),
  };
}

export function removeVaccineFromPet(pet: Pet, vaccineId: string): Pet {
  return {
    ...pet,
    vaccines: pet.vaccines.filter((vaccine) => vaccine.id !== vaccineId),
  };
}

export function addAllergyToPet(pet: Pet, allergy: NewAllergy): Pet {
  const allergyToAdd: Allergy =
    "id" in allergy ? allergy : { id: createId(), ...allergy };

  return {
    ...pet,
    allergies: [...pet.allergies, allergyToAdd],
  };
}

export function updateAllergyOnPet(pet: Pet, updatedAllergy: Allergy): Pet {
  return {
    ...pet,
    allergies: pet.allergies.map((allergy) =>
      allergy.id === updatedAllergy.id ? updatedAllergy : allergy,
    ),
  };
}

export function removeAllergyFromPet(pet: Pet, allergyId: string): Pet {
  return {
    ...pet,
    allergies: pet.allergies.filter((allergy) => allergy.id !== allergyId),
  };
}

export function addMedicationToPet(pet: Pet, medication: NewMedication): Pet {
  const medicationToAdd: Medication =
    "id" in medication ? medication : { id: createId(), ...medication };

  return {
    ...pet,
    medications: [...pet.medications, medicationToAdd],
  };
}

export function updateMedicationOnPet(
  pet: Pet,
  updatedMedication: Medication,
): Pet {
  return {
    ...pet,
    medications: pet.medications.map((medication) =>
      medication.id === updatedMedication.id ? updatedMedication : medication,
    ),
  };
}

export function removeMedicationFromPet(pet: Pet, medicationId: string): Pet {
  return {
    ...pet,
    medications: pet.medications.filter(
      (medication) => medication.id !== medicationId,
    ),
  };
}

export function updatePetPhotoOnPet(pet: Pet, photoUri: string): Pet {
  return {
    ...pet,
    photoUri,
  };
}

export async function addVaccine(
  petId: string,
  newVaccine: Vaccine,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(addVaccineToPet(pet, newVaccine));
}

export async function updateVaccine(
  petId: string,
  updatedVaccine: Vaccine,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(updateVaccineOnPet(pet, updatedVaccine));
}

export async function deleteVaccine(
  petId: string,
  vaccineId: string,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(removeVaccineFromPet(pet, vaccineId));
}

export async function addAllergy(
  petId: string,
  newAllergy: Allergy,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(addAllergyToPet(pet, newAllergy));
}

export async function updateAllergy(
  petId: string,
  updatedAllergy: Allergy,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(updateAllergyOnPet(pet, updatedAllergy));
}

export async function deleteAllergy(
  petId: string,
  allergyId: string,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(removeAllergyFromPet(pet, allergyId));
}

export async function addMedication(
  petId: string,
  newMedication: Medication,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(addMedicationToPet(pet, newMedication));
}

export async function updateMedication(
  petId: string,
  updatedMedication: Medication,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(updateMedicationOnPet(pet, updatedMedication));
}

export async function deleteMedication(
  petId: string,
  medicationId: string,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(removeMedicationFromPet(pet, medicationId));
}

export async function updatePetPhoto(
  petId: string,
  photoUri: string,
): Promise<void> {
  const pet = await getPetById(petId);
  if (!pet) return;

  await updatePet(updatePetPhotoOnPet(pet, photoUri));
}
