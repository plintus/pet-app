import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import PetForm from "../components/ui/PetForm";
import {
  addPetForCurrentUser,
  getPetByIdForCurrentUser,
  updatePetForCurrentUser,
} from "../storage/usersStorage";
import { Pet } from "../types/pet";

export default function AddEditPetScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    async function loadPet() {
      if (!id) return;
      const foundPet = await getPetByIdForCurrentUser(id);
      setPet(foundPet ?? null);
    }

    loadPet();
  }, [id]);

  const handleSubmit = async (values: Omit<Pet, "id">) => {
    if (id && pet) {
      await updatePetForCurrentUser({
        ...pet,
        ...values,
      });
    } else {
      await addPetForCurrentUser({
        id: Date.now().toString(),
        ...values,
      });
    }

    router.replace("/pets");
  };

  return (
    <View style={styles.container}>
      <PetForm initialValues={pet ?? undefined} onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
