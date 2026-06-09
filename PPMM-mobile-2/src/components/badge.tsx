import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { ReportStatus } from '../types';

interface StatusBadgeProps {
  status: ReportStatus | 'selesai' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = () => {
    const normStatus = status.toLowerCase();
    
    switch (normStatus) {
      case 'pending':
      case 'baru':
        return {
          text: 'Baru',
          backgroundColor: '#FEE2E2', // light red/pink
          textColor: '#EF4444',
        };
      case 'approved':
      case 'ditanggapi':
      case 'proses':
      case 'diproses':
        return {
          text: 'Ditanggapi',
          backgroundColor: '#FEF3C7', // light amber/yellow
          textColor: '#D97706',
        };
      case 'selesai':
      case 'resolved':
        return {
          text: 'Selesai',
          backgroundColor: '#D1FAE5', // light green
          textColor: '#10B981',
        };
      case 'rejected':
      case 'ditolak':
        return {
          text: 'Ditolak',
          backgroundColor: '#E5E7EB', // light gray
          textColor: '#4B5563',
        };
      default:
        return {
          text: status,
          backgroundColor: COLORS.primaryLight,
          textColor: COLORS.primary,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: config.textColor }]}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
});
