import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import PetCard from "../components/ui/PetCard";
import { clearCurrentUser, getCurrentUser } from "../storage/usersStorage";
import { Pet } from "../types/pet";

export default function PetListScreen() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [userName, setUserName] = useState("");

  const loadData = async () => {
    const user = await getCurrentUser();

    if (!user) {
      router.replace("/");
      return;
    }

    setUserName(user.name);
    setPets(user.pets);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleSwitchUser = async () => {
    await clearCurrentUser();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{userName}'s Pets</Text>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/pets/new")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard pet={item} onPress={() => router.push(`/pets/${item.id}`)} />
        )}
        ListEmptyComponent={<Text>No pets yet.</Text>}
        contentContainerStyle={{ paddingTop: 16 }}
      />
      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.submitButtonPressed,
        ]}
        onPress={() => handleSwitchUser()}
      >
        <Text style={styles.submitButtonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  actions: {
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: "#111",
    borderRadius: 10,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
});
