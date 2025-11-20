import HomeScreen from "@/app/(tabs)";
import { AuthProvider } from "@/contexts/AuthProvider";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

describe("Si el nombre esta vacio muestra error en la pantalla de inicio", () => {
  it('Si el nombre esta vacio muestra error en la pantalla de inicio.', async () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />, {wrapper: AuthProvider});
    const button = getByText("Crear taller");
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText("Nombre del taller:")).toBeTruthy();
      expect(getByPlaceholderText("Ej. Taller de Diseño UX")).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText("Ej. Taller de Diseño UX"), "");
    fireEvent.press(getByText("Confirmar"));

    await waitFor(() => {
      expect(getByText("El nombre debe tener al menos 2 caracteres")).toBeTruthy();
    });
  });
});