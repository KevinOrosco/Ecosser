import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

const AgregarCliente = ({ AbrirFormulario }: { AbrirFormulario: () => void }) => {

    return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => AbrirFormulario()}
          accessibilityLabel="Agregar cliente"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="plus" size={40} color="white" />
        </TouchableOpacity>
    );
};

export default AgregarCliente;

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 70, // Ajusta el ancho
    height: 70, // Ajusta el alto
    backgroundColor: "#28a745",
    borderRadius: 35, // La mitad del width y height para que sea un círculo
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Para Android (sombra)
  },
});