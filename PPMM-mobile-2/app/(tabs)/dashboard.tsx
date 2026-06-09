import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';
import { useReportStore } from '../../src/store/reportStore';
import { StatusBadge } from '../../src/components/badge';
import { PublicReport } from '../../src/types';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { reports, categories, fetchReports, fetchCategories, isLoading } = useReportStore();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    fetchReports();
    fetchCategories();
  }, []);

  // Compute statistics based on reports
  const totalCount = reports.length;
  const diprosesCount = reports.filter(r => r.status === 'approved' || r.status === 'pending').length;
  const selesaiCount = reports.filter(r => r.status === 'selesai').length;

  const getCategoryConfig = (catName: string) => {
    const normName = catName.toLowerCase();
    if (normName.includes('kebakaran') || normName.includes('api')) {
      return { icon: 'flame-outline', color: '#FEE2E2', iconColor: '#EF4444' };
    }
    if (normName.includes('hewan') || normName.includes('binatang')) {
      return { icon: 'bug-outline', color: '#D1FAE5', iconColor: '#10B981' };
    }
    if (normName.includes('banjir') || normName.includes('air')) {
      return { icon: 'water-outline', color: '#DBEAFE', iconColor: '#3B82F6' };
    }
    if (normName.includes('kecelakaan') || normName.includes('tabrak') || normName.includes('jalan') || normName.includes('infrastruktur')) {
      return { icon: 'car-outline', color: '#FEF3C7', iconColor: '#F59E0B' };
    }
    if (normName.includes('keamanan') || normName.includes('maling')) {
      return { icon: 'shield-checkmark-outline', color: '#E0F2FE', iconColor: '#0284C7' };
    }
    if (normName.includes('kebersihan') || normName.includes('sampah')) {
      return { icon: 'trash-outline', color: '#F3E8FF', iconColor: '#A855F7' };
    }
    if (normName.includes('fasilitas') || normName.includes('umum')) {
      return { icon: 'business-outline', color: '#FFE4E6', iconColor: '#F43F5E' };
    }
    if (normName.includes('pelayanan') || normName.includes('publik')) {
      return { icon: 'people-outline', color: '#ECFDF5', iconColor: '#059669' };
    }
    return { icon: 'alert-circle-outline', color: '#F3F4F6', iconColor: '#9CA3AF' };
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
    if (normName.includes('kecelakaan') || normName.includes('tabrak') || normName.includes('jalan') || normName.includes('infrastruktur')) {
      return { icon: 'car', color: '#FEF3C7', iconColor: '#F59E0B' };
    }
    if (normName.includes('keamanan') || normName.includes('maling')) {
      return { icon: 'shield-checkmark', color: '#E0F2FE', iconColor: '#0284C7' };
    }
    if (normName.includes('kebersihan') || normName.includes('sampah')) {
      return { icon: 'trash', color: '#F3E8FF', iconColor: '#A855F7' };
    }
    if (normName.includes('fasilitas') || normName.includes('umum')) {
      return { icon: 'business', color: '#FFE4E6', iconColor: '#F43F5E' };
    }
    if (normName.includes('pelayanan') || normName.includes('publik')) {
      return { icon: 'people', color: '#ECFDF5', iconColor: '#059669' };
    }
    return { icon: 'alert-circle', color: '#F3F4F6', iconColor: '#9CA3AF' };
  };

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  const getFilteredReports = () => {
    if (selectedCategory === null) {
      return reports;
    }
    return reports.filter(r => r.category_id === selectedCategory);
  };

  const recentReports = getFilteredReports().slice(0, 5);

  const renderReportItem = ({ item }: { item: PublicReport }) => {
    const categoryName = item.category?.category_name || 'Laporan';
    const theme = getCategoryTheme(categoryName);

    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => router.push(`/detail-laporan/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={[styles.reportIconContainer, { backgroundColor: theme.color }]}>
          <Ionicons name={theme.icon as any} size={22} color={theme.iconColor} />
        </View>
        <View style={styles.reportDetails}>
          <View style={styles.reportHeaderRow}>
            <Text style={styles.reportTitle} numberOfLines={1}>
              {item.header}
            </Text>
            <StatusBadge status={item.status} />
          </View>
          <View style={styles.reportLocationRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.reportLocationText} numberOfLines={1}>
              {item.location_name || 'Lokasi tidak dispesifikasikan'}
            </Text>
          </View>
          <Text style={styles.reportMetaText}>
            {getRelativeTime(item.created_at)} - Oleh {item.user?.username || 'Warga'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} style={styles.chevron} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Header Profile Bar */}
        <View style={styles.profileHeader}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.welcomeTextColumn}>
              <Text style={styles.greetingText}>Halo, selamat datang</Text>
              <Text style={styles.usernameText}>{user?.username || 'Pengguna'}</Text>
            </View>
          </View>
          
          <View style={styles.profileRight}>
            <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
              <View style={styles.bellBadge} />
            </TouchableOpacity>
            
            <View style={styles.headerLogoRow}>
              <View style={styles.headerLogoCircle}>
                <Ionicons name="call" size={12} color={COLORS.surface} />
              </View>
              <Text style={styles.headerLogoText}>LaporKita</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#FCE4EA' }]}>
              <Ionicons name="document-text" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.statNumber}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total Laporan</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={20} color="#D97706" />
            </View>
            <View>
              <Text style={styles.statNumber}>{diprosesCount}</Text>
              <Text style={styles.statLabel}>Diproses</Text>
            </View>
          </View>
          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
            <View>
              <Text style={styles.statNumber}>{selesaiCount}</Text>
              <Text style={styles.statLabel}>Selesai</Text>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Filter Kategori</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const config = getCategoryConfig(cat.category_name);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isSelected && { borderColor: COLORS.primary, borderWidth: 1.5 },
                ]}
                onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIconCircle, { backgroundColor: config.color }]}>
                  <Ionicons name={config.icon as any} size={18} color={config.iconColor} />
                </View>
                <Text style={styles.categoryPillText}>{cat.category_name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Latest Reports Title Row */}
        <View style={[styles.sectionHeaderRow, { marginTop: SPACING.lg }]}>
          <Text style={styles.sectionTitle}>Laporan Terbaru (5)</Text>
          <TouchableOpacity onPress={() => router.push('/laporan')} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Reports List */}
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
        ) : recentReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Belum ada laporan masuk</Text>
          </View>
        ) : (
          <FlatList
            data={recentReports}
            renderItem={renderReportItem}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/buat-laporan')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={COLORS.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100, // Leave space for FAB
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.lg : SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  welcomeTextColumn: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  usernameText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  profileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  bellButton: {
    position: 'relative',
    padding: SPACING.xs,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  headerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerLogoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogoText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    paddingBottom: 4,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  categoryIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPillText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  reportCard: {
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
  reportIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  reportDetails: {
    flex: 1,
    gap: 2,
  },
  reportHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: SPACING.sm,
  },
  reportTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.xs,
  },
  reportLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportLocationText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    flex: 1,
  },
  reportMetaText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 'auto',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
