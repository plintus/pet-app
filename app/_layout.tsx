import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pets/index" options={{ title: "My Pets" }} />
      <Stack.Screen name="pets/new" options={{ title: "Add Pet" }} />
      <Stack.Screen name="pets/[id]" options={{ title: "Pet Details" }} />
      <Stack.Screen name="pets/edit/[id]" options={{ title: "Edit Pet" }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
