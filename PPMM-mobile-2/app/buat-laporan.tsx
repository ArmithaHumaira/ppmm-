import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { useReportStore } from '../src/store/reportStore';
import { CustomButton } from '../src/components/button';
import { CustomInput } from '../src/components/input';

export default function BuatLaporanScreen() {
  const router = useRouter();
  const { categories, createReport, isActionLoading, error, clearError } = useReportStore();

  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    name?: string;
  } | null>(null);
  
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    clearError();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted' || locationStatus !== 'granted') {
        console.warn('Some permissions were not granted.');
      }
    }
  };

  const handlePickImage = async (source: 'camera' | 'library') => {
    try {
      let result;
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      };

      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Gagal mengambil gambar', 'Terjadi kesalahan saat memproses gambar.');
    }
  };

  const handleSelectImageSource = () => {
    Alert.alert(
      'Lampirkan Foto',
      'Pilih sumber foto pengaduan Anda',
      [
        { text: 'Kamera', onPress: () => handlePickImage('camera') },
        { text: 'Galeri', onPress: () => handlePickImage('library') },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin lokasi untuk menyematkan lokasi pengaduan.');
        setIsLocating(false);
        return;
      }

      const currentLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLoc.coords;

      // Reverse geocode to get readable address
      let name = `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      try {
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (address && address.length > 0) {
          const addr = address[0];
          const parts = [
            addr.street,
            addr.streetNumber,
            addr.district || addr.city,
            addr.region || addr.subregion,
          ].filter(Boolean);
          if (parts.length > 0) {
            name = parts.join(', ');
          }
        }
      } catch (err) {
        console.warn('Reverse geocoding failed', err);
      }

      setLocation({ latitude, longitude, name });
    } catch (e) {
      Alert.alert('Gagal Mendapatkan Lokasi', 'Pastikan GPS perangkat Anda aktif.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = async () => {
    if (!header.trim()) {
      Alert.alert('Input Tidak Valid', 'Judul laporan harus diisi.');
      return;
    }
    if (!body.trim()) {
      Alert.alert('Input Tidak Valid', 'Detail deskripsi laporan harus diisi.');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Input Tidak Valid', 'Kategori laporan harus dipilih.');
      return;
    }

    const success = await createReport(
      header,
      body,
      selectedCategoryId,
      imageUri || undefined,
      location || undefined
    );

    if (success) {
      Alert.alert('Laporan Terkirim', 'Laporan pengaduan Anda berhasil dikirim dan akan segera ditinjau.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Pengiriman Gagal', error || 'Terjadi kesalahan saat mengirim laporan.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Pengaduan</Text>
        <View style={{ width: 28 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Category Selector */}
        <Text style={styles.label}>Pilih Kategori Pengaduan</Text>
        <View style={styles.categoriesWrapper}>
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategoryId(cat.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryCardText,
                    isSelected && styles.categoryCardTextActive,
                  ]}
                >
                  {cat.category_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Inputs */}
        <CustomInput
          label="Judul Laporan / Kejadian"
          placeholder="Tuliskan judul laporan singkat..."
          value={header}
          onChangeText={setHeader}
        />

        <View style={styles.textareaContainer}>
          <Text style={styles.label}>Detail Laporan</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Jelaskan secara detail mengenai kejadian, lokasi spesifik, kronologi..."
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={6}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Image Attachment */}
        <Text style={styles.label}>Lampiran Foto</Text>
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.surface} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={handleSelectImageSource}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={36} color={COLORS.primary} />
            <Text style={styles.imagePlaceholderText}>Ketuk untuk mengambil/memilih foto</Text>
          </TouchableOpacity>
        )}

        {/* Location Attachment */}
        <Text style={[styles.label, { marginTop: SPACING.md }]}>Lokasi Pengaduan</Text>
        {location ? (
          <View style={styles.locationContainer}>
            <View style={styles.locationInfoRow}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={styles.locationNameText}>{location.name}</Text>
              <TouchableOpacity
                style={styles.editLocationButton}
                onPress={handleGetLocation}
                disabled={isLocating}
              >
                <Ionicons name="refresh" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.miniMapWrapper}>
              <MapView
                style={styles.miniMap}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={location} />
              </MapView>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.locationPlaceholder}
            onPress={handleGetLocation}
            disabled={isLocating}
            activeOpacity={0.7}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <Ionicons name="pin-outline" size={24} color={COLORS.primary} />
                <Text style={styles.locationPlaceholderText}>Sematkan Lokasi GPS Saat Ini</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Submit Button */}
        <CustomButton
          title="Kirim Pengaduan"
          isLoading={isActionLoading}
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    height: 56,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  categoryCard: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  categoryCardText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryCardTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  textareaContainer: {
    marginBottom: SPACING.md,
  },
  textarea: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    minHeight: 120,
    textAlignVertical: 'top',
    ...SHADOWS,
  },
  imagePlaceholder: {
    height: 140,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  imagePlaceholderText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPlaceholder: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  locationPlaceholderText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
  locationContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    gap: SPACING.sm,
    ...SHADOWS,
  },
  locationInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  locationNameText: {
    flex: 1,
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
    fontWeight: '500',
  },
  editLocationButton: {
    padding: SPACING.xs,
  },
  miniMapWrapper: {
    height: 120,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  miniMap: {
    width: '100%',
    height: '100%',
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
});
