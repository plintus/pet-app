import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
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

  const confirmDelete = () => {
    Alert.alert(
      "Delete pet?",
      `Are you sure you want to delete ${pet?.name} record?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
    );
  };

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
      <View style={styles.headerRow}>
        <Text style={styles.name}>{pet.name}</Text>

        <View style={styles.iconActions}>
          <Pressable
            style={styles.iconButton}
            onPress={() =>
              router.push({
                pathname: "/pets/edit/[id]",
                params: { id: pet.id },
              })
            }
          >
            <Ionicons name="pencil" size={20} color="#111" />
          </Pressable>

          <Pressable style={styles.iconButton} onPress={confirmDelete}>
            <Ionicons name="trash-outline" size={20} color="#111" />
          </Pressable>
        </View>
      </View>

      <Text>Type: {pet.type}</Text>
      <Text>Breed: {pet.breed || "N/A"}</Text>
      <Text>Notes: {pet.notes || "N/A"}</Text>
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
    maxWidth: "80%",
  },
  buttons: {
    marginTop: 20,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  iconActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
});
