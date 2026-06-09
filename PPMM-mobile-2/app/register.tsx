import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { CustomInput } from '../src/components/input';
import { CustomButton } from '../src/components/button';
import { useAuthStore } from '../src/store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    clearError();
  }, []);

  const validate = () => {
    let isValid = true;

    if (!fullName.trim()) {
      setFullNameError('Nama lengkap harus diisi');
      isValid = false;
    } else {
      setFullNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email harus diisi');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Format email tidak valid');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password harus diisi');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password minimal 8 karakter');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Konfirmasi password harus diisi');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Password tidak cocok');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    if (!agreeTerms) {
      Alert.alert('Syarat & Ketentuan', 'Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi untuk mendaftar.');
      return;
    }

    // Map fullName directly to username
    const username = fullName.trim();
    const success = await register(username, email, password);

    if (success) {
      Alert.alert('Registrasi Berhasil', 'Akun Anda berhasil dibuat. Silakan masuk.', [
        {
          text: 'Masuk Sekarang',
          onPress: () => router.replace('/login' as any),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Back Action */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          {/* Logo Section */}
          <View style={styles.headerLogoRow}>
            <View style={styles.logoCircle}>
              <Ionicons name="call" size={14} color={COLORS.surface} />
            </View>
            <Text style={styles.logoText}>LaporKita</Text>
          </View>

          {/* Heading */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>Isi data diri Anda untuk mendaftar</Text>
          </View>

          {/* Server Error Alert */}
          {error && (
            <View style={styles.errorAlert}>
              <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
              <Text style={styles.errorAlertText}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.formSection}>
            <CustomInput
              label="Nama Lengkap"
              iconName="person-outline"
              placeholder="Nama lengkap Anda"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (fullNameError) validate();
              }}
              error={fullNameError}
            />

            <CustomInput
              label="Email"
              iconName="mail-outline"
              placeholder="nama@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) validate();
              }}
              error={emailError}
            />

            <CustomInput
              label="Password"
              iconName="lock-closed-outline"
              placeholder="Minimal 8 karakter"
              isPassword
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) validate();
              }}
              error={passwordError}
            />

            <CustomInput
              label="Konfirmasi Password"
              iconName="lock-closed-outline"
              placeholder="Ulangi password"
              isPassword
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) validate();
              }}
              error={confirmPasswordError}
            />

            {/* Terms and Conditions Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.8}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View
                style={[
                  styles.checkbox,
                  agreeTerms && styles.checkboxChecked,
                ]}
              >
                {agreeTerms && <Ionicons name="checkmark" size={12} color={COLORS.surface} />}
              </View>
              <Text style={styles.checkboxLabel}>
                Saya setuju dengan{' '}
                <Text style={styles.linkText} onPress={() => Alert.alert('Syarat & Ketentuan', 'Detail Syarat & Ketentuan...')}>Syarat & Ketentuan</Text>
                {' '}dan{' '}
                <Text style={styles.linkText} onPress={() => Alert.alert('Kebijakan Privasi', 'Detail Kebijakan Privasi...')}>Kebijakan Privasi</Text>
              </Text>
            </TouchableOpacity>

            <CustomButton
              title="Daftar"
              isLoading={isLoading}
              onPress={handleRegister}
              style={styles.registerButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/login' as any)} activeOpacity={0.7}>
              <Text style={styles.signInText}>Masuk Sekarang</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.xs,
  },
  headerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  titleSection: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  errorAlertText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    flex: 1,
  },
  formSection: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
  },
  registerButton: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: SPACING.xxl,
  },
  footerText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  signInText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
});
