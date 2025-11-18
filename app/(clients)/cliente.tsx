import AgregarCliente from '@/components/clients/crear_cliente/button_crear_cliente';
import FormularioParaAgregarUnCliente from '@/components/clients/crear_cliente/formulario_crear_cliente';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [ addNewProduct, setAddNewProduct ] = useState(false);

  const handleAddNewProduct = () => {
    setAddNewProduct(true);
  };

  return (
    <>
    <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="home" size={22} color="#333" />
          <ThemedText>Clients</ThemedText>
          <Link href="/(products)/corte">
            <ThemedText type="link">Productos</ThemedText>
          </Link>
        </View>
    <AgregarCliente AbrirFormulario={handleAddNewProduct} />
    <Modal
          visible={addNewProduct}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddNewProduct(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FormularioParaAgregarUnCliente
                alCerrarElFormulario={() => setAddNewProduct(false)}
                alGuardarLosDatosDelFormulario={handleAddNewProduct}
                agregandoProducto={false}
              />
            </View>
          </View>
        </Modal>
        </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
