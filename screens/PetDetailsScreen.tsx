import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  addAllergyToPet,
  addMedicationToPet,
  addVaccineToPet,
  removeAllergyFromPet,
  removeMedicationFromPet,
  removeVaccineFromPet,
  updateAllergyOnPet,
  updateMedicationOnPet,
  updateVaccineOnPet,
} from "../storage/petsStorage";
import {
  deletePetForCurrentUser,
  getPetByIdForCurrentUser,
  updatePetForCurrentUser,
} from "../storage/usersStorage";
import { Pet } from "../types/pet";

type DetailTab = "info" | "vaccines" | "allergies" | "medications";
type Vaccine = Pet["vaccines"][number];
type Allergy = Pet["allergies"][number];
type Medication = Pet["medications"][number];
type AllergyReaction = Allergy["reactions"][number];
type AllergySeverity = Allergy["severity"];

const ALLERGY_REACTIONS: AllergyReaction[] = [
  "hives",
  "rash",
  "swelling",
  "vomiting",
  "itching",
  "trouble breathing",
  "other",
];

const ALLERGY_SEVERITIES: AllergySeverity[] = ["mild", "severe"];

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("info");

  const [newVaccineName, setNewVaccineName] = useState("");
  const [newVaccineDate, setNewVaccineDate] = useState("");
  const [showVaccineDatePicker, setShowVaccineDatePicker] = useState(false);
  const [tempVaccineDate, setTempVaccineDate] = useState(new Date());

  const [newAllergyName, setNewAllergyName] = useState("");
  const [newAllergyReactions, setNewAllergyReactions] = useState<
    AllergyReaction[]
  >([]);
  const [newAllergySeverity, setNewAllergySeverity] =
    useState<AllergySeverity>("mild");

  const [newMedicationName, setNewMedicationName] = useState("");
  const [newMedicationDosage, setNewMedicationDosage] = useState("");
  const [newMedicationInstructions, setNewMedicationInstructions] =
    useState("");

  const [editingVaccineId, setEditingVaccineId] = useState<string | null>(null);
  const [editVaccineName, setEditVaccineName] = useState("");
  const [editVaccineDate, setEditVaccineDate] = useState("");
  const [showEditVaccineDatePicker, setShowEditVaccineDatePicker] =
    useState(false);
  const [tempEditVaccineDate, setTempEditVaccineDate] = useState(new Date());

  const [editingAllergyId, setEditingAllergyId] = useState<string | null>(null);
  const [editAllergyName, setEditAllergyName] = useState("");
  const [editAllergyReactions, setEditAllergyReactions] = useState<
    AllergyReaction[]
  >([]);
  const [editAllergySeverity, setEditAllergySeverity] =
    useState<AllergySeverity>("mild");

  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(
    null,
  );
  const [editMedicationName, setEditMedicationName] = useState("");
  const [editMedicationDosage, setEditMedicationDosage] = useState("");
  const [editMedicationInstructions, setEditMedicationInstructions] =
    useState("");

  useEffect(() => {
    async function loadPet() {
      if (!id) return;
      const foundPet = await getPetByIdForCurrentUser(id);
      setPet(foundPet ?? null);
    }

    loadPet();
  }, [id]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const saveUpdatedPet = async (updatedPet: Pet) => {
    setPet(updatedPet);
    await updatePetForCurrentUser(updatedPet);
  };

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

  const handleVaccineDateChange = (_event: any, selectedDate?: Date) => {
    if (!selectedDate) {
      if (Platform.OS === "android") {
        setShowVaccineDatePicker(false);
      }
      return;
    }

    setTempVaccineDate(selectedDate);

    if (Platform.OS === "android") {
      setNewVaccineDate(formatDate(selectedDate));
      setShowVaccineDatePicker(false);
    }
  };

  const handleEditVaccineDateChange = (_event: any, selectedDate?: Date) => {
    if (!selectedDate) {
      if (Platform.OS === "android") {
        setShowEditVaccineDatePicker(false);
      }
      return;
    }

    setTempEditVaccineDate(selectedDate);

    if (Platform.OS === "android") {
      setEditVaccineDate(formatDate(selectedDate));
      setShowEditVaccineDatePicker(false);
    }
  };

  const handleAddVaccine = async () => {
    if (!pet || !newVaccineName.trim() || !newVaccineDate) return;

    const updatedPet = addVaccineToPet(pet, {
      name: newVaccineName.trim(),
      dateAdministered: newVaccineDate,
    });

    await saveUpdatedPet(updatedPet);
    setNewVaccineName("");
    setNewVaccineDate("");
  };

  const handleRemoveVaccine = async (vaccineId: string) => {
    if (!pet) return;

    const updatedPet = removeVaccineFromPet(pet, vaccineId);
    await saveUpdatedPet(updatedPet);

    if (editingVaccineId === vaccineId) {
      cancelEditVaccine();
    }
  };

  const startEditVaccine = (vaccine: Vaccine) => {
    setEditingVaccineId(vaccine.id);
    setEditVaccineName(vaccine.name);
    setEditVaccineDate(vaccine.dateAdministered);
    setTempEditVaccineDate(
      vaccine.dateAdministered
        ? new Date(vaccine.dateAdministered)
        : new Date(),
    );
  };

  const cancelEditVaccine = () => {
    setEditingVaccineId(null);
    setEditVaccineName("");
    setEditVaccineDate("");
    setShowEditVaccineDatePicker(false);
  };

  const saveEditedVaccine = async () => {
    if (
      !pet ||
      !editingVaccineId ||
      !editVaccineName.trim() ||
      !editVaccineDate
    ) {
      return;
    }

    const updatedPet = updateVaccineOnPet(pet, {
      id: editingVaccineId,
      name: editVaccineName.trim(),
      dateAdministered: editVaccineDate,
    });

    await saveUpdatedPet(updatedPet);
    cancelEditVaccine();
  };

  const toggleReaction = (reaction: AllergyReaction) => {
    setNewAllergyReactions((prev) =>
      prev.includes(reaction)
        ? prev.filter((item) => item !== reaction)
        : [...prev, reaction],
    );
  };

  const toggleEditReaction = (reaction: AllergyReaction) => {
    setEditAllergyReactions((prev) =>
      prev.includes(reaction)
        ? prev.filter((item) => item !== reaction)
        : [...prev, reaction],
    );
  };

  const handleAddAllergy = async () => {
    if (!pet || !newAllergyName.trim()) return;

    const updatedPet = addAllergyToPet(pet, {
      name: newAllergyName.trim(),
      reactions: newAllergyReactions,
      severity: newAllergySeverity,
    });

    await saveUpdatedPet(updatedPet);
    setNewAllergyName("");
    setNewAllergyReactions([]);
    setNewAllergySeverity("mild");
  };

  const handleRemoveAllergy = async (allergyId: string) => {
    if (!pet) return;

    const updatedPet = removeAllergyFromPet(pet, allergyId);
    await saveUpdatedPet(updatedPet);

    if (editingAllergyId === allergyId) {
      cancelEditAllergy();
    }
  };

  const startEditAllergy = (allergy: Allergy) => {
    setEditingAllergyId(allergy.id);
    setEditAllergyName(allergy.name);
    setEditAllergyReactions(allergy.reactions ?? []);
    setEditAllergySeverity(allergy.severity);
  };

  const cancelEditAllergy = () => {
    setEditingAllergyId(null);
    setEditAllergyName("");
    setEditAllergyReactions([]);
    setEditAllergySeverity("mild");
  };

  const saveEditedAllergy = async () => {
    if (!pet || !editingAllergyId || !editAllergyName.trim()) return;

    const updatedPet = updateAllergyOnPet(pet, {
      id: editingAllergyId,
      name: editAllergyName.trim(),
      reactions: editAllergyReactions,
      severity: editAllergySeverity,
    });

    await saveUpdatedPet(updatedPet);
    cancelEditAllergy();
  };

  const handleAddMedication = async () => {
    if (!pet || !newMedicationName.trim()) return;

    const updatedPet = addMedicationToPet(pet, {
      name: newMedicationName.trim(),
      dosage: newMedicationDosage.trim(),
      instructions: newMedicationInstructions.trim(),
    });

    await saveUpdatedPet(updatedPet);
    setNewMedicationName("");
    setNewMedicationDosage("");
    setNewMedicationInstructions("");
  };

  const handleRemoveMedication = async (medicationId: string) => {
    if (!pet) return;

    const updatedPet = removeMedicationFromPet(pet, medicationId);
    await saveUpdatedPet(updatedPet);

    if (editingMedicationId === medicationId) {
      cancelEditMedication();
    }
  };

  const startEditMedication = (medication: Medication) => {
    setEditingMedicationId(medication.id);
    setEditMedicationName(medication.name);
    setEditMedicationDosage(medication.dosage);
    setEditMedicationInstructions(medication.instructions);
  };

  const cancelEditMedication = () => {
    setEditingMedicationId(null);
    setEditMedicationName("");
    setEditMedicationDosage("");
    setEditMedicationInstructions("");
  };

  const saveEditedMedication = async () => {
    if (!pet || !editingMedicationId || !editMedicationName.trim()) return;

    const updatedPet = updateMedicationOnPet(pet, {
      id: editingMedicationId,
      name: editMedicationName.trim(),
      dosage: editMedicationDosage.trim(),
      instructions: editMedicationInstructions.trim(),
    });

    await saveUpdatedPet(updatedPet);
    cancelEditMedication();
  };

  const renderInfoTab = () => (
    <View style={styles.section}>
      <View style={styles.photoWrapper}>
        {pet?.photoUri ? (
          <Image source={{ uri: pet.photoUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.placeholderText}>🐾</Text>
          </View>
        )}
      </View>

      <Text style={styles.rowText}>Type: {pet?.type || "N/A"}</Text>
      <Text style={styles.rowText}>Breed: {pet?.breed || "N/A"}</Text>
      <Text style={styles.rowText}>
        Date of Birth: {pet?.dateOfBirth || "N/A"}
      </Text>
      <Text style={styles.rowText}>Notes: {pet?.notes || "N/A"}</Text>
    </View>
  );

  const renderVaccinesTab = () => (
    <View style={styles.section}>
      {pet?.vaccines?.length ? (
        pet.vaccines.map((vaccine: Vaccine) => {
          const isEditing = editingVaccineId === vaccine.id;

          return (
            <View key={vaccine.id} style={styles.card}>
              {isEditing ? (
                <>
                  <TextInput
                    placeholder="Vaccine name"
                    value={editVaccineName}
                    onChangeText={setEditVaccineName}
                    style={styles.input}
                  />

                  <Pressable
                    style={styles.input}
                    onPress={() => {
                      setTempEditVaccineDate(
                        editVaccineDate
                          ? new Date(editVaccineDate)
                          : new Date(),
                      );
                      setShowEditVaccineDatePicker(true);
                    }}
                  >
                    <Text
                      style={
                        editVaccineDate
                          ? styles.selectedText
                          : styles.placeholderText
                      }
                    >
                      {editVaccineDate || "Select date administered..."}
                    </Text>
                  </Pressable>

                  {showEditVaccineDatePicker ? (
                    <View style={styles.datePickerWrapper}>
                      <DateTimePicker
                        value={tempEditVaccineDate}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        maximumDate={new Date()}
                        onChange={handleEditVaccineDateChange}
                      />

                      {Platform.OS === "ios" ? (
                        <Pressable
                          style={styles.secondaryButton}
                          onPress={() => {
                            setEditVaccineDate(formatDate(tempEditVaccineDate));
                            setShowEditVaccineDatePicker(false);
                          }}
                        >
                          <Text style={styles.secondaryButtonText}>
                            Use This Date
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ) : null}

                  <View style={styles.editActionsRow}>
                    <Pressable
                      style={styles.secondaryActionButton}
                      onPress={cancelEditVaccine}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </Pressable>

                    <Pressable
                      style={styles.primaryActionButton}
                      onPress={saveEditedVaccine}
                    >
                      <Text style={styles.primaryButtonText}>Save</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {vaccine.name || "Unnamed vaccine"}
                    </Text>

                    <View style={styles.inlineActions}>
                      <Pressable
                        style={styles.inlineEditButton}
                        onPress={() => startEditVaccine(vaccine)}
                      >
                        <Ionicons name="pencil" size={18} color="#111" />
                      </Pressable>

                      <Pressable
                        style={styles.inlineDeleteButton}
                        onPress={() => handleRemoveVaccine(vaccine.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#b91c1c"
                        />
                      </Pressable>
                    </View>
                  </View>

                  <Text style={styles.cardText}>
                    Date Administered: {vaccine.dateAdministered || "N/A"}
                  </Text>
                </>
              )}
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No vaccines added.</Text>
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Add Vaccine</Text>

        <TextInput
          placeholder="Vaccine name"
          value={newVaccineName}
          onChangeText={setNewVaccineName}
          style={styles.input}
        />

        <Pressable
          style={styles.input}
          onPress={() => {
            setTempVaccineDate(
              newVaccineDate ? new Date(newVaccineDate) : new Date(),
            );
            setShowVaccineDatePicker(true);
          }}
        >
          <Text
            style={
              newVaccineDate ? styles.selectedText : styles.placeholderText
            }
          >
            {newVaccineDate || "Select date administered..."}
          </Text>
        </Pressable>

        {showVaccineDatePicker ? (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={tempVaccineDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={handleVaccineDateChange}
            />

            {Platform.OS === "ios" ? (
              <Pressable
                style={styles.secondaryButton}
                onPress={() => {
                  setNewVaccineDate(formatDate(tempVaccineDate));
                  setShowVaccineDatePicker(false);
                }}
              >
                <Text style={styles.secondaryButtonText}>Use This Date</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <Pressable style={styles.primaryButton} onPress={handleAddVaccine}>
          <Text style={styles.primaryButtonText}>Add Vaccine</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderAllergiesTab = () => (
    <View style={styles.section}>
      {pet?.allergies?.length ? (
        pet.allergies.map((allergy: Allergy) => {
          const isEditing = editingAllergyId === allergy.id;

          return (
            <View key={allergy.id} style={styles.card}>
              {isEditing ? (
                <>
                  <TextInput
                    placeholder="Allergy name"
                    value={editAllergyName}
                    onChangeText={setEditAllergyName}
                    style={styles.input}
                  />

                  <Text style={styles.subLabel}>Reactions</Text>
                  <View style={styles.chipsRow}>
                    {ALLERGY_REACTIONS.map((reaction) => {
                      const selected = editAllergyReactions.includes(reaction);

                      return (
                        <Pressable
                          key={reaction}
                          style={[styles.chip, selected && styles.chipSelected]}
                          onPress={() => toggleEditReaction(reaction)}
                        >
                          <Text
                            style={
                              selected
                                ? styles.chipTextSelected
                                : styles.chipText
                            }
                          >
                            {reaction}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.subLabel}>Severity</Text>
                  <View style={styles.chipsRow}>
                    {ALLERGY_SEVERITIES.map((severity) => {
                      const selected = editAllergySeverity === severity;

                      return (
                        <Pressable
                          key={severity}
                          style={[styles.chip, selected && styles.chipSelected]}
                          onPress={() => setEditAllergySeverity(severity)}
                        >
                          <Text
                            style={
                              selected
                                ? styles.chipTextSelected
                                : styles.chipText
                            }
                          >
                            {severity}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.editActionsRow}>
                    <Pressable
                      style={styles.secondaryActionButton}
                      onPress={cancelEditAllergy}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </Pressable>

                    <Pressable
                      style={styles.primaryActionButton}
                      onPress={saveEditedAllergy}
                    >
                      <Text style={styles.primaryButtonText}>Save</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {allergy.name || "Unnamed allergy"}
                    </Text>

                    <View style={styles.inlineActions}>
                      <Pressable
                        style={styles.inlineEditButton}
                        onPress={() => startEditAllergy(allergy)}
                      >
                        <Ionicons name="pencil" size={18} color="#111" />
                      </Pressable>

                      <Pressable
                        style={styles.inlineDeleteButton}
                        onPress={() => handleRemoveAllergy(allergy.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#b91c1c"
                        />
                      </Pressable>
                    </View>
                  </View>

                  <Text style={styles.cardText}>
                    Reactions:{" "}
                    {allergy.reactions?.length
                      ? allergy.reactions.join(", ")
                      : "N/A"}
                  </Text>
                  <Text style={styles.cardText}>
                    Severity: {allergy.severity || "N/A"}
                  </Text>
                </>
              )}
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No allergies added.</Text>
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Add Allergy</Text>

        <TextInput
          placeholder="Allergy name"
          value={newAllergyName}
          onChangeText={setNewAllergyName}
          style={styles.input}
        />

        <Text style={styles.subLabel}>Reactions</Text>
        <View style={styles.chipsRow}>
          {ALLERGY_REACTIONS.map((reaction) => {
            const selected = newAllergyReactions.includes(reaction);

            return (
              <Pressable
                key={reaction}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggleReaction(reaction)}
              >
                <Text
                  style={selected ? styles.chipTextSelected : styles.chipText}
                >
                  {reaction}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.subLabel}>Severity</Text>
        <View style={styles.chipsRow}>
          {ALLERGY_SEVERITIES.map((severity) => {
            const selected = newAllergySeverity === severity;

            return (
              <Pressable
                key={severity}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setNewAllergySeverity(severity)}
              >
                <Text
                  style={selected ? styles.chipTextSelected : styles.chipText}
                >
                  {severity}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.primaryButton} onPress={handleAddAllergy}>
          <Text style={styles.primaryButtonText}>Add Allergy</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderMedicationsTab = () => (
    <View style={styles.section}>
      {pet?.medications?.length ? (
        pet.medications.map((medication: Medication) => {
          const isEditing = editingMedicationId === medication.id;

          return (
            <View key={medication.id} style={styles.card}>
              {isEditing ? (
                <>
                  <TextInput
                    placeholder="Medication name"
                    value={editMedicationName}
                    onChangeText={setEditMedicationName}
                    style={styles.input}
                  />

                  <TextInput
                    placeholder='Dosage, e.g. "3.35 mg"'
                    value={editMedicationDosage}
                    onChangeText={setEditMedicationDosage}
                    style={styles.input}
                  />

                  <TextInput
                    placeholder="Instructions"
                    value={editMedicationInstructions}
                    onChangeText={setEditMedicationInstructions}
                    style={[styles.input, styles.notesInput]}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />

                  <View style={styles.editActionsRow}>
                    <Pressable
                      style={styles.secondaryActionButton}
                      onPress={cancelEditMedication}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </Pressable>

                    <Pressable
                      style={styles.primaryActionButton}
                      onPress={saveEditedMedication}
                    >
                      <Text style={styles.primaryButtonText}>Save</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {medication.name || "Unnamed medication"}
                    </Text>

                    <View style={styles.inlineActions}>
                      <Pressable
                        style={styles.inlineEditButton}
                        onPress={() => startEditMedication(medication)}
                      >
                        <Ionicons name="pencil" size={18} color="#111" />
                      </Pressable>

                      <Pressable
                        style={styles.inlineDeleteButton}
                        onPress={() => handleRemoveMedication(medication.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#b91c1c"
                        />
                      </Pressable>
                    </View>
                  </View>

                  <Text style={styles.cardText}>
                    Dosage: {medication.dosage || "N/A"}
                  </Text>
                  <Text style={styles.cardText}>
                    Instructions: {medication.instructions || "N/A"}
                  </Text>
                </>
              )}
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No medications added.</Text>
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Add Medication</Text>

        <TextInput
          placeholder="Medication name"
          value={newMedicationName}
          onChangeText={setNewMedicationName}
          style={styles.input}
        />

        <TextInput
          placeholder='Dosage, e.g. "3.35 mg"'
          value={newMedicationDosage}
          onChangeText={setNewMedicationDosage}
          style={styles.input}
        />

        <TextInput
          placeholder="Instructions"
          value={newMedicationInstructions}
          onChangeText={setNewMedicationInstructions}
          style={[styles.input, styles.notesInput]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Pressable style={styles.primaryButton} onPress={handleAddMedication}>
          <Text style={styles.primaryButtonText}>Add Medication</Text>
        </Pressable>
      </View>
    </View>
  );

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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    flex: 1,
  },
  cardText: {
    fontSize: 15,
    color: "#333",
  },
  inlineActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineEditButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
  },
  inlineDeleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 10,
    marginTop: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    minHeight: 48,
    justifyContent: "center",
  },
  notesInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  selectedText: {
    color: "#111",
    fontSize: 16,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  chipText: {
    color: "#111",
  },
  chipTextSelected: {
    color: "#fff",
  },
  datePickerWrapper: {
    gap: 8,
  },
  editActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: "#111",
    borderRadius: 10,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 10,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 10,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  secondaryActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 10,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: "#111",
    fontSize: 15,
    fontWeight: "600",
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
  photoWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
});
