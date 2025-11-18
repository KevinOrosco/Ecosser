import { ThemedText } from "@/components/themed-text";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { z } from "zod";


// Define Zod schema for form validation
const schema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
});


const FormularioParaAgregarUnCliente = ({
  alCerrarElFormulario,
  alGuardarLosDatosDelFormulario,
  productoExistente,
}: {
  alCerrarElFormulario: () => void;
  alGuardarLosDatosDelFormulario: (data: z.infer<typeof schema>) => void;
  agregandoProducto: boolean;
  productoExistente?: {
    nombre: string;
  };
}) => {
  // Initialize the form with React Hook Form and Zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      nombre: productoExistente?.nombre || "",
    },
  });


  useEffect(() => {
    if (productoExistente) {
      reset({
        nombre: productoExistente.nombre || "",
      });
    } else {
      reset({
        nombre: "",
      });
    }
  }, [productoExistente, reset]);


  // Function to handle form submission
  const onSubmit = (data: z.infer<typeof schema>) => {
    const processedData = {
      ...data,
      nombre: String(data.nombre),
    };
    alGuardarLosDatosDelFormulario(processedData);
  };


  const onClose = () => {
    alCerrarElFormulario();
  };


  return (
    <View>
        <ThemedText style={styles_para_formulario.modalTitle}>
          {productoExistente ? "Editar Producto" : "Agregar Nuevo Producto"}
        </ThemedText>


      <View>
        {/* Primer campo */}
        <Controller
          control={control}
          name="nombre"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles_para_formulario.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Nombre del cliente *"
              ref={ref}
              placeholderTextColor="#999"
              testID="Nombre del cliente *"
            />
          )}
        />

        {(errors.nombre && (
          <Text style={styles_para_formulario.error}>
            {errors.nombre.message}
          </Text>
        ))}


        <View style={styles_para_formulario.modalButtons}>
          <TouchableOpacity
            style={[styles_para_formulario.modalButton, styles_para_formulario.cancelButton]}
            onPress={onClose}
          >
            <ThemedText style={styles_para_formulario.cancelButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>


          <TouchableOpacity
            style={[styles_para_formulario.modalButton, styles_para_formulario.saveButton]}
            onPress={handleSubmit(onSubmit)}
          >
            <ThemedText style={styles_para_formulario.saveButtonText}>Guardar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles_para_formulario = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
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
  inpu: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  quantityContainer: {
    marginBottom: 15,
    position: "relative",
  },
  quantityButton: {
    backgroundColor: "#a5a4a7ff",
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    marginTop: -20, // Mitad de la altura del botón para centrar exactamente
  },
  quantityButtonLeft: {
    left: 5,
  },
  quantityButtonRight: {
    right: 5,
  },
  quantityButtonDisabled: {
    backgroundColor: "#ccc",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: "center",
    minWidth: 80, // Para que no se vea demasiado pequeño
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
    cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
});


export default FormularioParaAgregarUnCliente;
