import CrearTaller from '@/components/talleres/crear_taller/button_crear_taller';
import FormularioParaCrearUnTaller from '@/components/talleres/crear_taller/formulario_crear_taller';
import UnirseTaller from '@/components/talleres/unirse_a_un_taller/button_unirse_a_taller';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthProvider';
import { createTaller, getTalleresByOwner, getTallerImageUrl, TallerData } from '@/services/pocketbaseServices';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth()
  const [addNewTaller, setAddNewTaller] = useState(false);
  const [joinTaller, setJoinTaller] = useState(false);
  const [talleres, setTalleres] = useState<TallerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar talleres al montar el componente
  useEffect(() => {
    loadTalleres();
  }, [user]);

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
        const filename = tallerData.icono.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('icon', {
            uri: tallerData.icono,
            name: filename,
            type: type, 
        } as any);
    }

    console.log("Enviando FormData...");
    const result = await createTaller(formData);
    setAddNewTaller(false);

    if (result.success) {
        Alert.alert("Éxito", "Taller creado correctamente.");
        // Recargar la lista después de crear
        loadTalleres();
    } else {
        Alert.alert("Error", result.error || "Fallo al crear el taller.");
    }
  };

  const loadTalleres = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const result = await getTalleresByOwner(user.id);
    if (result.success) {
      setTalleres(result.data || []);
    } else {
      Alert.alert("Error", result.error);
    }
    setLoading(false);
  }

  const getUserRoleInTaller = (taller: TallerData): string => {
    if (!user) return 'Empleado';
    
    if (taller.owner_id === user.id) {
      return 'Propietario';
    } else {
      return 'Empleado';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTalleres();
    setRefreshing(false);
  };

  // Componente para renderizar cada tarjeta de taller
  const renderTallerCard = ({ item }: { item: TallerData }) => {
    const userRole = getUserRoleInTaller(item);

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.imageContainer}>
          {item.icon ? (
            <Image 
              source={{ uri: getTallerImageUrl(item) || undefined }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <MaterialCommunityIcons name="garage" size={24} color="#666" />
            </View>
          )}
        </View>
        
        <View style={styles.cardContent}>
          <ThemedText style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </ThemedText>
          <View style={styles.roleContainer}>
            <ThemedText 
              style={[styles.cardSubtitle]} 
              type="defaultSemiBold"
            >
              {userRole}
            </ThemedText>
            {userRole === 'Propietario' && (
              <MaterialCommunityIcons 
                name="crown" 
                size={16} 
                color="#FFD700" 
                style={styles.crownIcon}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
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

      {/* Lista de talleres */}
      <View style={styles.talleresContainer}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Mis Talleres</ThemedText>
          <TouchableOpacity onPress={loadTalleres} disabled={loading}>
            <MaterialCommunityIcons name="reload" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : talleres.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="garage-variant" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              No tienes talleres creados
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Crea tu primer taller para comenzar
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={talleres}
            renderItem={renderTallerCard}
            keyExtractor={(item) => item.id || item.name}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Espacio flexible entre la lista y los botones */}
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
    backgroundColor: "#f5f5f5",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  talleresContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    marginRight: 4,
  },
  crownIcon: {
    marginLeft: 4,
  },
  spacer: {
    height: 20,
  },
  buttonsContainer: {
    gap: 12,
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
  loader: {
    marginTop: 50,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});