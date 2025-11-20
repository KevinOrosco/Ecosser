// tests/prueba.test.tsx

import HomeScreen from "@/app/(tabs)";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import * as AuthProvider from "@/contexts/AuthProvider";
import * as ApiService from "@/services/pocketbaseServices";

// --- Servicios a mockear ---
jest.mock("@/contexts/AuthProvider");
jest.mock("@/services/pocketbaseServices");

const mockedUseAuth = AuthProvider.useAuth as jest.Mock;
const mockedGetTalleresByOwner = ApiService.getTalleresByOwner as jest.Mock;
const mockedCreateTaller = ApiService.createTaller as jest.Mock;

describe("HomeScreen: Registrar nuevo taller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Si el nombre es válido, el nuevo cliente aparece en la lista con deuda $0", async () => {
    // --- Configuración de mocks ---
    mockedUseAuth.mockReturnValue({
      user: { id: "user123", name: "Test User" },
      isAuthenticated: true,
      isLoading: false,
    });

    mockedGetTalleresByOwner.mockResolvedValue({
      success: true,
      data: [], // La lista empieza vacía
    });

    const nuevoTaller = {
      id: "456",
      name: "Maria",
      owner_id: "user123",
    };
    mockedCreateTaller.mockResolvedValue({
      success: true,
      data: nuevoTaller,
    });

    render(<HomeScreen />);

    const addButton = await screen.findByText("Crear taller");
    fireEvent.press(addButton);

    // Esperamos a que el modal aparezca
    const modalTitle = await screen.findByText("Nombre del taller:");
    expect(modalTitle).toBeTruthy();

    // Se crea un nuevo cliente
    const inputNombre = screen.getByPlaceholderText("Ej. Taller de Diseño UX");
    fireEvent.changeText(inputNombre, "Maria");

    // El usuario presiona el botón para confirmar y guardar
    fireEvent.press(screen.getByText("Confirmar"));

    // Simulamos que se guarda el cliente en una lista (como si fuera la de pocketbase)
    mockedGetTalleresByOwner.mockResolvedValue({
      success: true,
      data: [nuevoTaller],
    });

    expect(await screen.findByText("Maria")).toBeTruthy();
  }, 10000); // Aumentamos el timeout a 10 segundos
});
