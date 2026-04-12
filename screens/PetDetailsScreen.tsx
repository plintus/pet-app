import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {
  deletePetForCurrentUser,
  getPetByIdForCurrentUser,
} from "../storage/usersStorage";
import { Pet } from "../types/pet";

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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

  const handleDelete = async () => {
    if (!id) return;
    await deletePetForCurrentUser(id);
    router.replace("/pets");
  };

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{pet.name}</Text>
      <Text>Type: {pet.type}</Text>
      <Text>Breed: {pet.breed || "N/A"}</Text>
      <Text>Notes: {pet.notes || "N/A"}</Text>

      <View style={styles.buttons}>
        <Button
          title="Edit"
          onPress={() =>
            router.push({
              pathname: `/pets/edit/[id]`,
              params: { id: pet.id },
            })
          }
        />
        <Button title="Delete" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  buttons: {
    marginTop: 20,
    gap: 12,
  },
});
