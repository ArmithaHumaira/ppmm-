import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { useReportStore } from '../../src/store/reportStore';
import { StatusBadge } from '../../src/components/badge';
import api from '../../src/api/axios';

export default function DetailLaporanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const reportId = Number(id);

  const {
    currentReport,
    comments,
    fetchReportDetails,
    fetchComments,
    addComment,
    isLoading,
    isActionLoading,
  } = useReportStore();

  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (reportId) {
      fetchReportDetails(reportId);
      fetchComments(reportId);
    }
  }, [reportId]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    
    const success = await addComment(reportId, commentText);
    if (success) {
      setCommentText('');
    } else {
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengirim komentar.');
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const rootUrl = api.defaults.baseURL?.replace('/api', '') || 'http://localhost:5000';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${rootUrl}${cleanPath}`;
  };

  // Generate location coords if none exist
  const getCoordinates = () => {
    if (currentReport?.latitude && currentReport?.longitude) {
      return { latitude: currentReport.latitude, longitude: currentReport.longitude };
    }
    // Static coordinate fallback
    return { latitude: -6.200000, longitude: 106.816666 };
  };

  if (isLoading && !currentReport) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!currentReport) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>Laporan tidak ditemukan.</Text>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const hasCoords = currentReport.latitude !== undefined && currentReport.longitude !== undefined;
  const imageUrl = getImageUrl(currentReport.image);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Pengaduan</Text>
          <View style={{ width: 24 }} /> {/* Spacer */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Photo Banner */}
          {imageUrl ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: imageUrl }} style={styles.photo} />
            </View>
          ) : (
            <View style={styles.noPhotoPlaceholder}>
              <Ionicons name="image-outline" size={48} color={COLORS.textSecondary} />
              <Text style={styles.noPhotoText}>Tidak ada foto yang dilampirkan</Text>
            </View>
          )}

          {/* Details Body Card */}
          <View style={styles.detailsCard}>
            <View style={styles.badgesRow}>
              <StatusBadge status={currentReport.status} />
              <View style={styles.categoryLabel}>
                <Text style={styles.categoryLabelText}>
                  {currentReport.category?.category_name || 'Umum'}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{currentReport.header}</Text>
            
            <Text style={styles.metaInfo}>
              Diajukan oleh {currentReport.user?.username || 'Warga'} pada{' '}
              {new Date(currentReport.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.body}>{currentReport.body}</Text>
          </View>

          {/* Location details */}
          <Text style={styles.sectionTitle}>Peta Lokasi</Text>
          <View style={styles.mapCard}>
            <View style={styles.mapInfoRow}>
              <Ionicons name="location" size={18} color={COLORS.primary} />
              <Text style={styles.mapAddressText} numberOfLines={2}>
                {currentReport.location_name || 'Lokasi tidak dispesifikasikan secara detail'}
              </Text>
            </View>
            
            <View style={styles.mapWrapper}>
              <MapView
                style={styles.map}
                initialRegion={{
                  ...getCoordinates(),
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={getCoordinates()} />
              </MapView>
            </View>
          </View>

          {/* Comments Section */}
          <Text style={styles.sectionTitle}>Komentar & Tindak Lanjut ({comments.length})</Text>
          <View style={styles.commentsCard}>
            {comments.length === 0 ? (
              <Text style={styles.emptyCommentsText}>Belum ada komentar untuk laporan ini.</Text>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>
                      {comment.user?.username || 'Anonim'}
                    </Text>
                    {comment.user?.role && comment.user.role !== 'user' && (
                      <View style={styles.officerBadge}>
                        <Text style={styles.officerBadgeText}>Petugas</Text>
                      </View>
                    )}
                    <Text style={styles.commentDate}>
                      {new Date(comment.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.commentBody}>{comment.body}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Comment Input Sticky Bar */}
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Tulis tanggapan atau komentar..."
            value={commentText}
            onChangeText={setCommentText}
            placeholderTextColor={COLORS.textSecondary}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !commentText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={!commentText.trim() || isActionLoading}
          >
            {isActionLoading ? (
              <ActivityIndicator size="small" color={COLORS.surface} />
            ) : (
              <Ionicons name="send" size={20} color={COLORS.surface} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
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
    paddingBottom: 40,
  },
  photoContainer: {
    height: 240,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noPhotoPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  noPhotoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  categoryLabel: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryLabelText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 28,
    marginBottom: SPACING.xs,
  },
  metaInfo: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  body: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  mapCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS,
  },
  mapInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  mapAddressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    flex: 1,
  },
  mapWrapper: {
    height: 160,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  commentsCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS,
  },
  emptyCommentsText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    paddingVertical: SPACING.md,
  },
  commentItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  commentUser: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  officerBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  officerBadgeText: {
    fontSize: 9,
    color: COLORS.surface,
    fontWeight: '700',
  },
  commentDate: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 'auto',
  },
  commentBody: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  commentInputRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    color: COLORS.text,
    fontSize: FONTS.sizes.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  backLink: {
    marginTop: SPACING.lg,
  },
  backLinkText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
});
