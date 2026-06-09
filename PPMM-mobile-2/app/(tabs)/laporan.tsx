import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { useReportStore } from '../../src/store/reportStore';
import { StatusBadge } from '../../src/components/badge';
import { PublicReport } from '../../src/types';

export default function LaporanScreen() {
  const router = useRouter();
  const { reports, categories, fetchReports, isLoading } = useReportStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    fetchReports();
    requestLocationPermission();
  }, []);

  // Refetch reports when search or category selection changes
  useEffect(() => {
    fetchReports({
      search: searchQuery || undefined,
      categoryId: selectedCategory || undefined,
    });
  }, [searchQuery, selectedCategory]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation(location.coords);
      }
    } catch (error) {
      console.warn('Failed to get location permission:', error);
    }
  };

  // Helper to generate coordinates if not available in the database
  const getCoordinates = (item: PublicReport, index: number) => {
    if (item.latitude && item.longitude) {
      return { latitude: item.latitude, longitude: item.longitude };
    }
    
    // Generate deterministic mock coordinates based on the item ID or index around the user's location
    const baseLat = userLocation?.latitude || -6.200000; // Jakarta default
    const baseLng = userLocation?.longitude || 106.816666;
    
    // Scatter markers slightly
    const offsetLat = Math.sin(item.id + index) * 0.008;
    const offsetLng = Math.cos(item.id + index) * 0.008;
    
    return {
      latitude: baseLat + offsetLat,
      longitude: baseLng + offsetLng,
    };
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

  const renderReportItem = ({ item, index }: { item: PublicReport; index: number }) => {
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
            - Oleh {item.user?.username || 'Warga'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Search & Filter Section */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari laporan..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textSecondary}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            activeOpacity={0.7}
          >
            <Ionicons name={viewMode === 'list' ? 'map-outline' : 'list-outline'} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Categories horizontally scrolling list */}
        <View style={{ marginTop: SPACING.sm }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            <TouchableOpacity
              style={[
                styles.categoryPill,
                selectedCategory === null && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(null)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedCategory === null && styles.categoryPillTextActive,
                ]}
              >
                Semua
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryPill,
                    isActive && styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      isActive && styles.categoryPillTextActive,
                    ]}
                  >
                    {cat.category_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>Laporan tidak ditemukan</Text>
            <Text style={styles.emptySubtitle}>Silakan ubah pencarian atau filter kategori Anda</Text>
          </View>
        ) : (
          <FlatList
            data={reports}
            renderItem={renderReportItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        /* Map View Mode */
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude || -6.200000,
              longitude: userLocation?.longitude || 106.816666,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {reports.map((item, index) => {
              const coords = getCoordinates(item, index);
              const theme = getCategoryTheme(item.category?.category_name || '');
              
              return (
                <Marker
                  key={item.id}
                  coordinate={coords}
                  title={item.header}
                  description={item.location_name}
                  pinColor={theme.iconColor}
                >
                  <Callout
                    tooltip
                    onPress={() => router.push(`/detail-laporan/${item.id}`)}
                  >
                    <View style={styles.calloutCard}>
                      <Text style={styles.calloutTitle}>{item.header}</Text>
                      <Text style={styles.calloutDesc} numberOfLines={2}>{item.body}</Text>
                      <View style={styles.calloutFooter}>
                        <StatusBadge status={item.status} />
                        <Text style={styles.calloutLink}>Lihat Detail &gt;</Text>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </View>
      )}

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
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? SPACING.md : 0,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    height: '100%',
    padding: 0,
  },
  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    paddingBottom: 4,
  },
  categoryPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryPillActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  categoryPillText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  list: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 85,
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
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutCard: {
    width: 220,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#1F2937',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
    }),
  },
  calloutTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutLink: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '700',
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
