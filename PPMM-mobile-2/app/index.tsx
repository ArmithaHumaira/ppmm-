import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { CustomButton } from '../src/components/button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.content}>
        {/* Top Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.smallLogoCircle}>
            <Ionicons name="call" size={24} color={COLORS.surface} />
          </View>
          <Text style={styles.logoText}>LaporKita</Text>
          <Text style={styles.logoSubtitle}>Solusi Digital Anda</Text>
        </View>

        {/* Center Artwork/Icon Section */}
        <View style={styles.artworkSection}>
          <View style={styles.largeArtworkCircle}>
            <Ionicons name="call-outline" size={72} color={COLORS.primary} />
          </View>
        </View>

        {/* Bottom Actions Section */}
        <View style={styles.actionsSection}>
          <CustomButton
            title="Mulai Sekarang"
            variant="primary"
            onPress={() => router.push('/register' as any)}
            style={styles.button}
          />
          <CustomButton
            title="Sudah Punya Akun? Masuk"
            variant="secondary"
            onPress={() => router.push('/login' as any)}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
    justifyContent: 'space-between',
    paddingVertical: SPACING.xxxl,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  smallLogoCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.primary,
    // Add a slight tilt/styled look if desired, but bold is standard
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  artworkSection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  largeArtworkCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionsSection: {
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
});
