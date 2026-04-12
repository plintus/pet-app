import AsyncStorage from "@react-native-async-storage/async-storage";
import { Allergy, Medication, Pet, Vaccine } from "../types/pet";

const PETS_KEY = "pets";

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

export async function addVaccine(
  petId: string,
  newVaccine: Vaccine,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          vaccines: [...pet.vaccines, newVaccine],
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function updateVaccine(
  petId: string,
  updatedVaccine: Vaccine,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          vaccines: pet.vaccines.map((vaccine) =>
            vaccine.id === updatedVaccine.id ? updatedVaccine : vaccine,
          ),
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function deleteVaccine(
  petId: string,
  vaccineId: string,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          vaccines: pet.vaccines.filter((vaccine) => vaccine.id !== vaccineId),
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function addAllergy(
  petId: string,
  newAllergy: Allergy,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          allergies: [...pet.allergies, newAllergy],
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function updateAllergy(
  petId: string,
  updatedAllergy: Allergy,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          allergies: pet.allergies.map((allergy) =>
            allergy.id === updatedAllergy.id ? updatedAllergy : allergy,
          ),
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function deleteAllergy(
  petId: string,
  allergyId: string,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          allergies: pet.allergies.filter(
            (allergy) => allergy.id !== allergyId,
          ),
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function addMedication(
  petId: string,
  newMedication: Medication,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          medications: [...pet.medications, newMedication],
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function updateMedication(
  petId: string,
  updatedMedication: Medication,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          medications: pet.medications.map((medication) =>
            medication.id === updatedMedication.id
              ? updatedMedication
              : medication,
          ),
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function deleteMedication(
  petId: string,
  medicationId: string,
): Promise<void> {
  const pets = await getPets();

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          medications: pet.medications.filter(
            (medication) => medication.id !== medicationId,
          ),
        }
      : pet,
  );

  await savePets(updatedPets);
}

export async function updatePetPhoto(
  petId: string,
  photoUri: string,
): Promise<void> {
  const pets = await getPets();

  console.log("pets", pets);

  const updatedPets = pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          photoUri,
        }
      : pet,
  );

  console.log("Updating pet photo URI for pet ID:", petId);
  console.log("New photo URI:", photoUri);
  console.log("Updated pets array:", updatedPets);

  await savePets(updatedPets);
}
