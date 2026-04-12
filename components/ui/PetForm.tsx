import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Pet } from "../../types/pet";

type Props = {
  initialValues?: Partial<Pet>;
  onSubmit: (values: Omit<Pet, "id">) => void;
};

const PET_TYPES = ["dog", "cat", "bird", "reptile", "other"];

export default function PetForm({ initialValues, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [notes, setNotes] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [tempDob, setTempDob] = useState(new Date());

  const [vaccines, setVaccines] = useState<Pet["vaccines"]>([]);
  const [allergies, setAllergies] = useState<Pet["allergies"]>([]);
  const [medications, setMedications] = useState<Pet["medications"]>([]);

  useEffect(() => {
    setName(initialValues?.name ?? "");
    setType(initialValues?.type ?? "");
    setBreed(initialValues?.breed ?? "");
    setNotes(initialValues?.notes ?? "");
    setDateOfBirth(initialValues?.dateOfBirth ?? "");

    if (initialValues?.dateOfBirth) {
      setTempDob(new Date(initialValues.dateOfBirth));
    }

    setVaccines(initialValues?.vaccines ?? []);
    setAllergies(initialValues?.allergies ?? []);
    setMedications(initialValues?.medications ?? []);
  }, [initialValues]);

  const label = initialValues ? "Update Pet Info" : "Add New Pet";

  const formatLabel = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openDobPicker = () => {
    const startingDate = dateOfBirth ? new Date(dateOfBirth) : new Date();
    setTempDob(startingDate);
    setShowDobPicker(true);
  };

  const handleAndroidDobChange = (_event: any, selectedDate?: Date) => {
    setShowDobPicker(false);

    if (selectedDate) {
      setTempDob(selectedDate);
      setDateOfBirth(formatDate(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Type</Text>
      <Pressable style={styles.input} onPress={() => setShowTypeModal(true)}>
        <Text style={type ? styles.selectedText : styles.placeholderText}>
          {type ? formatLabel(type) : "Select pet type..."}
        </Text>
      </Pressable>

      <Modal
        visible={showTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select pet type</Text>

            {PET_TYPES.map((item) => (
              <Pressable
                key={item}
                style={styles.option}
                onPress={() => {
                  setType(item);
                  setShowTypeModal(false);
                }}
              >
                <Text style={styles.optionText}>{formatLabel(item)}</Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowTypeModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Birthday (approximate is fine)</Text>
      <Pressable style={styles.input} onPress={openDobPicker}>
        <Text
          style={dateOfBirth ? styles.selectedText : styles.placeholderText}
        >
          {dateOfBirth || "Select date of birth..."}
        </Text>
      </Pressable>

      {showDobPicker && Platform.OS === "android" ? (
        <DateTimePicker
          value={tempDob}
          mode="date"
          display="default"
          onChange={handleAndroidDobChange}
          maximumDate={new Date()}
        />
      ) : null}

      <Modal
        visible={showDobPicker && Platform.OS === "ios"}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDobPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select date of birth</Text>

            <DateTimePicker
              value={tempDob}
              mode="date"
              display="spinner"
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  setTempDob(selectedDate);
                }
              }}
              maximumDate={new Date()}
              style={styles.iosPicker}
            />

            <View style={styles.dobButtonRow}>
              <Pressable
                style={styles.footerButton}
                onPress={() => setShowDobPicker(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.footerButton}
                onPress={() => {
                  setDateOfBirth(formatDate(tempDob));
                  setShowDobPicker(false);
                }}
              >
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Breed</Text>
      <TextInput
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
        style={styles.input}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
      />

      <Button
        title={label}
        onPress={() =>
          onSubmit({
            name,
            type,
            breed,
            notes,
            dateOfBirth,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
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
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  selectedText: {
    color: "#111",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  iosPicker: {
    backgroundColor: "#fff",
  },
  dobButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  footerButton: {
    padding: 12,
  },
  doneText: {
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
});
