import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { signInOrCreateUser } from "../storage/usersStorage";
import { buttonStyles } from "../styles/buttonStyles";

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = async () => {
    try {
      setError("");
      await signInOrCreateUser(name);
      router.replace("/pets");
    } catch (e) {
      setError("Please enter a name.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Info App</Text>
      <Text style={styles.label}>Enter your name</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        style={styles.input}
        autoCapitalize="words"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={({ pressed }) => [
          buttonStyles.submitButton,
          pressed && buttonStyles.submitButtonPressed,
        ]}
        onPress={handleContinue}
      >
        <Text style={buttonStyles.submitButtonText}>Log in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
  },
});
