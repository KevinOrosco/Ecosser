import { ThemedText } from "@/components/themed-text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

const UnirseTaller = ({ AbrirFormulario }: { AbrirFormulario: () => void }) => {

    return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => AbrirFormulario()}
          accessibilityLabel="Crear taller"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="plus" size={24} color="white"/>
          <ThemedText style={styles.addButtonText}>Unirse a un taller</ThemedText>
        </TouchableOpacity>
    );
};

export default UnirseTaller;

const styles = StyleSheet.create({
  addButton: {
    width: "100%",
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});