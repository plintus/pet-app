import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Pet } from "../../types/pet";

type Props = {
  pet: Pet;
  onPress: () => void;
};

export default function PetCard({ pet, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {pet.photoUri ? (
        <Image source={{ uri: pet.photoUri }} style={styles.photo} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>🐾</Text>{" "}
          {/* // Placeholder for pets without photos; can make a custom icon based on the breed */}
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.meta}>{pet.type}</Text>
        {pet.breed ? <Text style={styles.meta}>{pet.breed}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eee",
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    color: "#444",
  },
});
