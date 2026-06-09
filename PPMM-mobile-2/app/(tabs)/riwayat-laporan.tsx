import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';
import { useReportStore } from '../../src/store/reportStore';
import { StatusBadge } from '../../src/components/badge';
import { PublicReport } from '../../src/types';

type StatusFilter = 'semua' | 'pending' | 'approved' | 'selesai' | 'rejected';

export default function RiwayatLaporanScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { reports, myReports, fetchMyReports, fetchReports, isLoading } = useReportStore();
  
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('semua');

  useEffect(() => {
    fetchReports();
    fetchMyReports();
  }, []);

  // Filter reports locally to guarantee list shows up even if API '/reports/my' is missing
  const getFilteredReports = () => {
    // Determine user's reports. Try using myReports first; if empty, fallback to filtering global reports list
    let userReports = myReports.length > 0 
      ? myReports 
      : reports.filter((r) => r.user_id === user?.id || r.user?.username === user?.username);

    if (statusFilter !== 'semua') {
      userReports = userReports.filter((r) => {
        if (statusFilter === 'pending') return r.status === 'pending';
        if (statusFilter === 'approved') return r.status === 'approved';
        if (statusFilter === 'selesai') return r.status === 'selesai';
        if (statusFilter === 'rejected') return r.status === 'rejected';
        return true;
      });
    }

    return userReports;
  };

  const getCategoryTheme = (catName: string) => {
    const normName = catName.toLowerCase();
    if (normName.includes('kebakaran') || normName.includes('api')) {
      return { icon: 'flame', color: '#FEE2E2', iconColor: '#EF4444' };
    }
    if (normName.includes('hewan') || normName.includes('binatang')) {
      return { icon: 'bug', color: '#D1FAE5', iconColor: '#10B981' };
    }
    if (normName.includes('banjir') || normName.includes('air')) {
      return { icon: 'water', color: '#DBEAFE', iconColor: '#3B82F6' };
    }
    if (normName.includes('kecelakaan') || normName.includes('tabrak') || normName.includes('jalan')) {
      return { icon: 'car', color: '#FEF3C7', iconColor: '#F59E0B' };
    }
    return { icon: 'alert-circle', color: '#F3F4F6', iconColor: '#9CA3AF' };
  };

  const filteredData = getFilteredReports();

  const renderReportItem = ({ item }: { item: PublicReport }) => {
    const categoryName = item.category?.category_name || 'Laporan';
    const theme = getCategoryTheme(categoryName);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/detail-laporan/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.color }]}>
          <Ionicons name={theme.icon as any} size={22} color={theme.iconColor} />
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.header}
            </Text>
            <StatusBadge status={item.status} />
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location_name || 'Lokasi tidak dispesifikasikan'}
            </Text>
          </View>
          <Text style={styles.metaText}>
            {new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}{' '}
            - Oleh Anda
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Pengaduan</Text>
        <Text style={styles.headerSubtitle}>Pantau status pengaduan yang telah Anda kirimkan</Text>
      </View>

      {/* Tabs Filter Bar */}
      <View style={styles.tabsContainer}>
        {(['semua', 'pending', 'approved', 'selesai'] as const).map((status) => {
          const isActive = statusFilter === status;
          const label = 
            status === 'semua' ? 'Semua' :
            status === 'pending' ? 'Baru' :
            status === 'approved' ? 'Diproses' : 'Selesai';

          return (
            <TouchableOpacity
              key={status}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setStatusFilter(status)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List content */}
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Belum ada riwayat pengaduan</Text>
          <Text style={styles.emptySubtitle}>
            {statusFilter === 'semua'
              ? 'Anda belum pernah mengirimkan laporan pengaduan.'
              : 'Tidak ada laporan dengan status ini.'}
          </Text>
          {statusFilter === 'semua' && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/buat-laporan')}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>Buat Laporan Baru</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderReportItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  list: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS,
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardDetails: {
    flex: 1,
    gap: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    flex: 1,
  },
  metaText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  createButtonText: {
    color: COLORS.surface,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
});
