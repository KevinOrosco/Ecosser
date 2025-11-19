import { ThemedText } from "@/components/themed-text";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
// Importar la librería de selección de imágenes
import * as ImagePicker from 'expo-image-picker';
// Si NO usas Expo, usa: import * as ImagePicker from 'react-native-image-picker';

import { z } from "zod";

// Define Zod schema para la validación (se mantiene igual)
const schema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    // Campo opcional para el URI de la imagen local
    icono: z.string().optional(),
});

type TallerFormData = z.infer<typeof schema>;

interface FormProps {
    alCerrarElFormulario: () => void;
    alGuardarLosDatosDelFormulario: (data: TallerFormData) => void;
    tallerExistente?: TallerFormData;
    editandoTaller: boolean;
}

const FormularioParaCrearUnTaller = ({
    alCerrarElFormulario,
    alGuardarLosDatosDelFormulario,
    tallerExistente,
    editandoTaller,
}: FormProps) => {
    
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TallerFormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            nombre: tallerExistente?.nombre || "",
            icono: tallerExistente?.icono || "", 
        },
    });

    useEffect(() => {
        if (tallerExistente) {
            reset({
                nombre: tallerExistente.nombre || "",
                icono: tallerExistente.icono || "",
            });
        } else {
            reset({
                nombre: "",
                icono: "",
            });
        }
    }, [tallerExistente, reset]);

    const pickImage = async (onChange: (uri: string) => void) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('¡Necesitas permisos para acceder a la galería!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            onChange(uri); 
        }
    };

    const onSubmit = (data: TallerFormData) => {
        alGuardarLosDatosDelFormulario(data);
    };

    const onClose = () => {
        alCerrarElFormulario();
    };

    return (
        <View style={styles_para_formulario.modalContent}> 
            {/* Botón de Cierre "X" */}
            <TouchableOpacity style={styles_para_formulario.closeButton} onPress={onClose}>
                <ThemedText style={styles_para_formulario.closeButtonText}>X</ThemedText>
            </TouchableOpacity>

            <View style={styles_para_formulario.formContainer}>
                
                {/* 1. Campo Nombre del Taller */}
                <ThemedText style={styles_para_formulario.label}>
                    Nombre del taller:
                </ThemedText>
                <Controller
                    control={control}
                    name="nombre"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextInput
                            style={styles_para_formulario.inpu}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Ej. Taller de Diseño UX"
                            ref={ref}
                            placeholderTextColor="#999"
                        />
                    )}
                />

                {(errors.nombre && (
                    <Text style={styles_para_formulario.error}>
                        {errors.nombre.message}
                    </Text>
                ))}

                {/* 2. Campo Icono */}
                <ThemedText style={styles_para_formulario.label}>
                    Icono:
                </ThemedText>
                <Controller
                    control={control}
                    name="icono" 
                    render={({ field: { onChange, value } }) => (
                        <View style={styles_para_formulario.imagePickerContainer}>
                            <TouchableOpacity
                                style={styles_para_formulario.imagePickerButton_sketch} // Estilo basado en el boceto
                                onPress={() => pickImage(onChange)}
                            >
                                {/* Muestra "+ Añade un icono" o la previsualización */}
                                {value ? (
                                    <View style={styles_para_formulario.previewContainer}>
                                        <Text style={styles_para_formulario.previewText_selected}>
                                            {`✅ Icono seleccionado`}
                                        </Text>
                                        {/* Puedes añadir una previsualización de la imagen si lo deseas */}
                                        {/* <Image source={{ uri: value }} style={styles_para_formulario.previewImage} /> */}
                                    </View>
                                ) : (
                                    <Text style={styles_para_formulario.imagePickerButtonText_sketch}>
                                        + Añade un icono
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                />

                {/* 3. Botón de Confirmar (Guardar) */}
                <TouchableOpacity
                    style={styles_para_formulario.confirmButton_sketch}
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text style={styles_para_formulario.confirmButtonText_sketch}>
                        Confirmar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles_para_formulario = StyleSheet.create({
    // --- ESTILOS GENERALES Y LAYOUT ---
    modalContent: { // Este debería ser el contenedor principal del modal (si no está fuera)
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        width: "100%",
        maxWidth: 400,
        alignSelf: 'center', // Para centrarlo si el View padre lo permite
    },
    formContainer: {
        paddingTop: 10, // Espacio después del botón de cerrar
    },
    // --- BOTÓN DE CIERRE "X" ---
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 15,
        zIndex: 10,
        padding: 5,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    // --- ETIQUETAS Y INPUTS ---
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333', // Color de texto similar al boceto
    },
    inpu: {
        borderWidth: 1,
        borderColor: "#999", // Un poco más oscuro para contrastar
        borderRadius: 8,
        padding: 12,
        marginBottom: 20, // Más espacio entre campos
        fontSize: 16,
    },
    error: {
        color: "red",
        marginBottom: 10,
        marginTop: -15,
    },
    // --- CAMPO ICONO (Basado en el boceto) ---
    imagePickerContainer: {
        marginBottom: 30, // Espacio antes del botón de Confirmar
    },
    imagePickerButton_sketch: {
        borderWidth: 1,
        borderColor: "#999", // Borde similar al input
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50, // Altura similar al TextInput
    },
    imagePickerButtonText_sketch: {
        fontSize: 16,
        color: '#666', // Color de texto de placeholder/label
    },
    previewContainer: {
        alignItems: 'center',
    },
    previewText_selected: {
        fontSize: 16,
        color: '#28a745', // Verde para indicar selección exitosa
    },
    // --- BOTÓN CONFIRMAR ---
    confirmButton_sketch: {
        backgroundColor: "#000", // Color negro o muy oscuro para el botón principal
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        // Sombra opcional para darle más profundidad
    },
    confirmButtonText_sketch: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default FormularioParaCrearUnTaller;