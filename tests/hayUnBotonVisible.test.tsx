import HomeScreen from "@/app/(tabs)";
import { AuthProvider } from "@/contexts/AuthProvider";
import { render } from "@testing-library/react-native";

describe("Hay un boton visible en la pantalla de inicio", () => {
  it('En la pantalla de "Tus Talleres", existe un botón visible para "Crear un nuevo Taller".', async () => {
    const { getByText } = render(<HomeScreen />, {wrapper: AuthProvider});
    const button = getByText("Crear taller");
    expect(button).toBeTruthy();
  });
});

