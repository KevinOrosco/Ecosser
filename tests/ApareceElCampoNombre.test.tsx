import HomeScreen from "@/app/(tabs)";
import { AuthProvider } from "@/contexts/AuthProvider";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

describe("Aparece el campo nombre en la pantalla de inicio", () => {
  it('Aparece el campo nombre en la pantalla de inicio.', async () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />, {wrapper: AuthProvider});
    const button = getByText("Crear taller");
    fireEvent.press(button);

    await waitFor(() => {
      const nombre = getByText("Nombre del taller:");
      expect(getByPlaceholderText("Ej. Taller de Diseño UX")).toBeTruthy();
      expect(nombre).toBeTruthy();
    });
  });
});