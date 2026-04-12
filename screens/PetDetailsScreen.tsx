import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  deletePetForCurrentUser,
  getPetByIdForCurrentUser,
} from "../storage/usersStorage";
import { Pet } from "../types/pet";

type DetailTab = "info" | "vaccines" | "allergies" | "medications";

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("info");

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

  const renderInfoTab = () => (
    <View style={styles.section}>
      <Text style={styles.rowText}>Type: {pet?.type || "N/A"}</Text>
      <Text style={styles.rowText}>Breed: {pet?.breed || "N/A"}</Text>
      <Text style={styles.rowText}>
        Date of Birth: {pet?.dateOfBirth || "N/A"}
      </Text>
      <Text style={styles.rowText}>Notes: {pet?.notes || "N/A"}</Text>
    </View>
  );

  const renderVaccinesTab = () => {
    if (!pet?.vaccines?.length) {
      return <Text style={styles.emptyText}>No vaccines added.</Text>;
    }

    return (
      <View style={styles.section}>
        {pet.vaccines.map((vaccine) => (
          <View key={vaccine.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {vaccine.name || "Unnamed vaccine"}
            </Text>
            <Text style={styles.cardText}>
              Date Administered: {vaccine.dateAdministered || "N/A"}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderAllergiesTab = () => {
    if (!pet?.allergies?.length) {
      return <Text style={styles.emptyText}>No allergies added.</Text>;
    }

    return (
      <View style={styles.section}>
        {pet.allergies.map((allergy) => (
          <View key={allergy.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {allergy.name || "Unnamed allergy"}
            </Text>
            <Text style={styles.cardText}>
              Reactions:{" "}
              {allergy.reactions?.length ? allergy.reactions.join(", ") : "N/A"}
            </Text>
            <Text style={styles.cardText}>
              Severity: {allergy.severity || "N/A"}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderMedicationsTab = () => {
    if (!pet?.medications?.length) {
      return <Text style={styles.emptyText}>No medications added.</Text>;
    }

    return (
      <View style={styles.section}>
        {pet.medications.map((medication) => (
          <View key={medication.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {medication.name || "Unnamed medication"}
            </Text>
            <Text style={styles.cardText}>
              Dosage: {medication.dosage || "N/A"}
            </Text>
            <Text style={styles.cardText}>
              Instructions: {medication.instructions || "N/A"}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "vaccines":
        return renderVaccinesTab();
      case "allergies":
        return renderAllergiesTab();
      case "medications":
        return renderMedicationsTab();
      case "info":
      default:
        return renderInfoTab();
    }
  };

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
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

        {renderTabContent()}
      </ScrollView>

      <View style={styles.bottomMenu}>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "info" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("info")}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={activeTab === "info" ? "#111" : "#666"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "info" && styles.activeTabLabel,
            ]}
          >
            Info
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === "vaccines" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("vaccines")}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={activeTab === "vaccines" ? "#111" : "#666"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "vaccines" && styles.activeTabLabel,
            ]}
          >
            Vaccines
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === "allergies" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("allergies")}
        >
          <Ionicons
            name="warning-outline"
            size={20}
            color={activeTab === "allergies" ? "#111" : "#666"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "allergies" && styles.activeTabLabel,
            ]}
          >
            Allergies
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === "medications" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("medications")}
        >
          <Ionicons
            name="medkit-outline"
            size={20}
            color={activeTab === "medications" ? "#111" : "#666"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "medications" && styles.activeTabLabel,
            ]}
          >
            Meds
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    maxWidth: "80%",
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
  section: {
    gap: 12,
  },
  rowText: {
    fontSize: 16,
    color: "#111",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  cardText: {
    fontSize: 15,
    color: "#333",
  },
  bottomMenu: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: "#f3f4f6",
  },
  tabLabel: {
    fontSize: 12,
    color: "#666",
  },
  activeTabLabel: {
    color: "#111",
    fontWeight: "600",
  },
});
