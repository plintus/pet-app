import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
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
      <Text style={styles.title}>{userName}'s Pets</Text>

      <View style={styles.actions}>
        <Button title="Add Pet" onPress={() => router.push("/pets/new")} />
        <Button title="Switch User" onPress={handleSwitchUser} />
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
});
