import { Stack } from 'expo-router';
export default function ProductLayout() {
  return (
    <Stack>
      <Stack.Screen name="corte" options={{ headerShown: false }} />
    </Stack>
  );
}