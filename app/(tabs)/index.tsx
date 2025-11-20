import CrearTaller from '@/components/talleres/crear_taller/button_crear_taller';
import FormularioParaCrearUnTaller from '@/components/talleres/crear_taller/formulario_crear_taller';
import UnirseTaller from '@/components/talleres/unirse_a_un_taller/button_unirse_a_taller';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthProvider';
import { createTaller } from '@/services/pocketbaseServices';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth()
  const [addNewTaller, setAddNewTaller] = useState(false);
  const [joinTaller, setJoinTaller] = useState(false);

const handleAddNewTaller = async (tallerData: { nombre: string; icono?: string; }) => {
    if (!user) {
        Alert.alert("Error", "No hay usuario autenticado");
        return;
    }

    setAddNewTaller(true);

    const formData = new FormData();
    
    formData.append('name', tallerData.nombre); 
    formData.append('owner_id', user.id); 

    if (tallerData.icono) {
        try {
            const response = await fetch(tallerData.icono);
            const blob = await response.blob();
            
            const filename = tallerData.icono.substring(tallerData.icono.lastIndexOf('/') + 1);

            formData.append('icon', blob, filename); 

        } catch (e) {
            console.error("No se pudo adjuntar el icono al FormData:", e);
            Alert.alert("Advertencia", "El taller se guardará sin icono.");

        }
    }

    const result = await createTaller(formData);

    setAddNewTaller(false);

    if (result.success) {
        Alert.alert("Éxito", "Taller creado correctamente.");
    } else {
        Alert.alert("Error", result.error || "Fallo al crear el taller.");
    }
};

  return (
    <View style={styles.container}>
      {/* Encabezado en la parte superior */}
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons name="home" size={22} color="#333" />
        <ThemedText>Home</ThemedText>
        <Link href="/(clients)/cliente">
          <ThemedText type="link">Clientes</ThemedText>
        </Link>
      </View>

      {/* Espacio flexible entre el título y los botones */}
      <View style={styles.spacer} />

      {/* Botones en la parte inferior */}
      <View style={styles.buttonsContainer}>
        <CrearTaller AbrirFormulario={() => setAddNewTaller(true)} />
        <UnirseTaller AbrirFormulario={() => setJoinTaller(true)} />
      </View>

      <Modal
        visible={addNewTaller}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddNewTaller(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FormularioParaCrearUnTaller
              alCerrarElFormulario={() => setAddNewTaller(false)}
              alGuardarLosDatosDelFormulario={handleAddNewTaller}
              editandoTaller={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spacer: {
    flex: 1, // Esto empujará los botones hacia abajo
  },
  buttonsContainer: {
    gap: 12,
    // No necesita flex: 1, solo un contenedor con el ancho completo
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
});