import { Pressable, StyleSheet, Text } from "react-native";
import { Pet } from "../../types/pet";

type Props = {
  pet: Pet;
  onPress: () => void;
};

export default function PetCard({ pet, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.name}>{pet.name}</Text>
      <Text>{pet.type}</Text>
      {pet.breed ? <Text>{pet.breed}</Text> : null}
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
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
});
