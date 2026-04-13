import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>User Flows</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. First Time User</Text>
          <Text style={styles.bullet}>• See welcome screen</Text>
          <Text style={styles.bullet}>
            • Create account by entering username
          </Text>
          <Text style={styles.bullet}>• Add first pet</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Returning User</Text>
          <Text style={styles.bullet}>• See list of all their pets</Text>
          <Text style={styles.bullet}>
            • Tap a pet to view details and medical records
          </Text>
          <Text style={styles.bullet}>
            • Add, edit, or delete pets and records
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Adding Records</Text>
          <Text style={styles.bullet}>• Navigate to pet detail</Text>
          <Text style={styles.bullet}>
            • Choose record type: vaccine, allergy, or medication
          </Text>
          <Text style={styles.bullet}>
            • Fill out the form with the appropriate inputs
          </Text>
          <Text style={styles.bullet}>
            • Save and see it appear in the pet&apos;s medical history
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  section: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },
});
