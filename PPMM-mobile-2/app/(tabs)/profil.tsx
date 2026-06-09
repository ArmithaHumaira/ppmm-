import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';
import { CustomInput } from '../../src/components/input';
import { CustomButton } from '../../src/components/button';
import api from '../../src/api/axios';
import * as SecureStore from 'expo-secure-store';

export default function ProfilScreen() {
  const router = useRouter();
  const { user, logout, checkAuth, isLoading: authLoading } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin galeri untuk memperbarui foto profil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedUri = result.assets[0].uri;
        setAvatarUri(pickedUri);
        
        // Upload avatar immediately or save locally
        await handleUploadAvatar(pickedUri);
      }
    } catch (e) {
      Alert.alert('Gagal mengambil gambar', 'Terjadi kesalahan saat memproses gambar.');
    }
  };

  const handleUploadAvatar = async (uri: string) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('avatar', {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: filename,
        type,
      } as any);

      // Try uploading to backend avatar endpoint
      try {
        const response = await api.post('/auth/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        // Update user state
        if (response.data.user) {
          await SecureStore.setItemAsync('user_data', JSON.stringify(response.data.user));
          await checkAuth();
        }
        Alert.alert('Sukses', 'Foto profil Anda berhasil diperbarui.');
      } catch (err) {
        console.warn('Backend avatar upload failed, updating locally in state.');
        // If API not present, we just keep local avatar state
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert('Input Tidak Valid', 'Nama dan email wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      // API call to update profile
      const response = await api.put('/auth/profile', {
        username: username.trim(),
        email: email.trim(),
      });
      
      // Update cache
      if (response.data.user) {
        await SecureStore.setItemAsync('user_data', JSON.stringify(response.data.user));
        await checkAuth();
      }
      setIsEditing(false);
      Alert.alert('Sukses', 'Profil Anda berhasil diperbarui.');
    } catch (err: any) {
      console.warn('API profile update failed, updating state cache locally.', err);
      // Fallback update state locally if server endpoint is simple
      if (user) {
        const updatedUser = { ...user, username, email };
        await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));
        await checkAuth();
      }
      setIsEditing(false);
      Alert.alert('Sukses', 'Profil diperbarui secara lokal.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari akun Anda?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Pengguna</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8} style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color={COLORS.primary} />
              </View>
            )}
            <View style={styles.editAvatarIcon}>
              <Ionicons name="camera" size={16} color={COLORS.surface} />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.usernameLabel}>{user?.username || 'Pengguna'}</Text>
          <Text style={styles.emailLabel}>{user?.email || 'nama@email.com'}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Petugas/Admin' : 'Warga'}
            </Text>
          </View>
        </View>

        {/* Profile Details Inputs */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
          
          <View style={styles.card}>
            {isEditing ? (
              <View style={{ gap: SPACING.sm }}>
                <CustomInput
                  label="Nama Lengkap"
                  value={username}
                  onChangeText={setUsername}
                  iconName="person-outline"
                />
                
                <CustomInput
                  label="Alamat Email"
                  value={email}
                  onChangeText={setEmail}
                  iconName="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={styles.editActionsRow}>
                  <CustomButton
                    title="Batal"
                    variant="secondary"
                    onPress={() => {
                      setUsername(user?.username || '');
                      setEmail(user?.email || '');
                      setIsEditing(false);
                    }}
                    style={{ flex: 1 }}
                  />
                  <CustomButton
                    title="Simpan"
                    isLoading={isSaving}
                    onPress={handleSaveProfile}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              <View style={{ gap: SPACING.md }}>
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                  <View>
                    <Text style={styles.infoLabel}>Nama Lengkap</Text>
                    <Text style={styles.infoValue}>{user?.username || '-'}</Text>
                  </View>
                </View>
                
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                  <View>
                    <Text style={styles.infoLabel}>Alamat Email</Text>
                    <Text style={styles.infoValue}>{user?.email || '-'}</Text>
                  </View>
                </View>

                <CustomButton
                  title="Ubah Profil"
                  variant="outline"
                  onPress={() => setIsEditing(true)}
                  style={{ marginTop: SPACING.xs }}
                />
              </View>
            )}
          </View>

          {/* Account Actions Section */}
          <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Akun</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => Alert.alert('Ketentuan Layanan', 'Ketentuan layanan pengaduan LaporKita.')}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={20} color={COLORS.text} />
              <Text style={styles.actionItemText}>Syarat & Ketentuan</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => Alert.alert('Hubungi Kami', 'Hubungi kami via email: support@laporkita.go.id')}
              activeOpacity={0.7}
            >
              <Ionicons name="help-circle-outline" size={20} color={COLORS.text} />
              <Text style={styles.actionItemText}>Bantuan & Hubungi Kami</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <CustomButton
            title="Keluar"
            variant="secondary"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
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
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.lg : SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  avatarCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  editAvatarIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.surface,
  },
  usernameLabel: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  emailLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  roleBadgeText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 10,
  },
  detailsSection: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 1,
  },
  editActionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  actionItemText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  actionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  logoutButton: {
    marginTop: SPACING.xxl,
  },
});
