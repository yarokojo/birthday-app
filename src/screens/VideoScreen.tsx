import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, Platform, useWindowDimensions } from "react-native";
import { Heart, MessageCircle, Share2, Music, Gift as GiftIcon, ArrowLeft, Volume2, VolumeX, Camera, PartyPopper, Sparkles, Plus, Check, Cake, X } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { BlurView } from "expo-blur";
import { Video, ResizeMode } from "expo-av";
import { ReelItem } from "../types";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get('window');

const VIRTUAL_GIFTS = [
  { id: 'cake', icon: '🎂', label: 'Cake', price: '₵5' },
  { id: 'balloon', icon: '🎈', label: 'Balloon', price: '₵1' },
  { id: 'party', icon: '🎉', label: 'Popper', price: '₵2' },
  { id: 'spark', icon: '✨', label: 'Magic', price: '₵10' },
];

interface Wish {
  id: string;
  text: string;
  user: string;
}

export default function VideoScreen({ reels = [], userProfileImage, onBack, onNavigate }: { reels?: ReelItem[], userProfileImage: string, onBack?: () => void, onNavigate?: (screen: string, id?: string, mode?: 'post' | 'video') => void }) {
  const { theme } = useTheme();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const onMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / screenHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    setProgress(0);
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (activeIndex < reels.length - 1) {
            setActiveIndex(activeIndex + 1);
          }
          return 0;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [activeIndex, reels.length]);

  const toggleFollow = (handle: string) => {
    const newFollows = new Set(followedUsers);
    if (newFollows.has(handle)) {
      newFollows.delete(handle);
    } else {
      newFollows.add(handle);
    }
    setFollowedUsers(newFollows);
  };
  
  const [showGifts, setShowGifts] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    const texts = ["Happy Birthday! 🎂", "Looking sharp! ✨", "Enjoy! 🍰", "Turn up! 🥂", "Best vibes! 🎊"];
    const interval = setInterval(() => {
      const newWish = {
        id: Math.random().toString(),
        text: texts[Math.floor(Math.random() * texts.length)],
        user: ["@alex", "@sam", "@maya", "@john", "@lisa"][Math.floor(Math.random() * 5)]
      };
      setWishes(prev => [newWish, ...prev].slice(0, 3));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const [lastTap, setLastTap] = useState<number | null>(null);
  const [showHeart, setShowHeart] = useState<{ id: string, x: number, y: number } | null>(null);

  const handleDoubleTap = (videoId: string, event: any) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      toggleLike(videoId);
      setShowHeart({ id: Math.random().toString(), x: event.nativeEvent.locationX - 40, y: event.nativeEvent.locationY - 40 });
      setTimeout(() => setShowHeart(null), 1000);
    } else {
      setLastTap(now);
    }
  };

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedVideos);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedVideos(newLiked);
  };

  const handleCelebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar - Top */}
      <View style={styles.progressBarContainer}>
        {reels.map((_, idx) => (
          <View key={idx} style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: idx === activeIndex ? `${progress}%` : idx < activeIndex ? '100%' : '0%',
                  backgroundColor: theme.primary
                }
              ]} 
            />
          </View>
        ))}
      </View>

      <ScrollView 
        pagingEnabled 
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {reels.map((video, index) => (
          <View key={video.id} style={[styles.videoPage, { height: screenHeight, width: screenWidth }]}>
            <Video
              source={{ uri: video.videoUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay={index === activeIndex}
              isLooping={false}
              isMuted={false}
              posterSource={{ uri: video.poster }}
              usePoster
            />
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={(e) => handleDoubleTap(video.id, e)} 
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.gradientOverlay} pointerEvents="none" />

            <AnimatePresence>
              {showHeart && (
                <MotiView
                  key={showHeart.id}
                  from={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0, scale: 2 }}
                  style={[styles.heartOverlay, { left: showHeart.x, top: showHeart.y }]}
                >
                  <Heart size={80} color="#ef4444" fill="#ef4444" />
                </MotiView>
              )}
            </AnimatePresence>

            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.topBarLeft}>
                {onBack && (
                  <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <BlurView intensity={20} tint="dark" style={styles.blurPad}>
                      <ArrowLeft size={20} color="#fff" />
                    </BlurView>
                  </TouchableOpacity>
                )}
                <View style={styles.navTabs}>
                  <Text style={[styles.navTab, styles.navTabActive]}>For You</Text>
                  <Text style={styles.navTab}>Following</Text>
                  <Text style={styles.navTab}>Live</Text>
                </View>
              </View>
              <View style={styles.topBarRight}>
                <TouchableOpacity onPress={() => onNavigate?.('post', undefined, 'video')} style={styles.cameraBtn}>
                  <BlurView intensity={20} tint="dark" style={styles.blurPad}>
                    <Camera size={20} color="#fff" />
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMuted(!muted)} style={styles.muteBtn}>
                  <BlurView intensity={20} tint="dark" style={styles.blurPad}>
                    {muted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right Sidebar */}
            <View style={styles.sidebar}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => toggleFollow(video.handle)}
                style={styles.authorSection}
              >
                <Image source={{ uri: video.avatar }} style={styles.sidebarAvatar} />
                <MotiView 
                  animate={{ 
                    scale: followedUsers.has(video.handle) ? 1.1 : 1,
                    backgroundColor: followedUsers.has(video.handle) ? "#10b981" : "#ef4444",
                    rotate: followedUsers.has(video.handle) ? '360deg' : '0deg'
                  }}
                  transition={{ type: 'spring', damping: 12 }}
                  style={styles.followBadge}
                >
                  {followedUsers.has(video.handle) ? <Check size={10} color="#fff" strokeWidth={4} /> : <Plus size={10} color="#fff" strokeWidth={4} />}
                </MotiView>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleLike(video.id)} style={styles.sidebarBtn}>
                <Heart size={28} color={likedVideos.has(video.id) ? "#ef4444" : "#fff"} fill={likedVideos.has(video.id) ? "#ef4444" : "none"} />
                <Text style={styles.sidebarLabel}>{video.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowComments(true)} style={styles.sidebarBtn}>
                <MessageCircle size={28} color="#fff" />
                <Text style={styles.sidebarLabel}>{video.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCelebrate} style={styles.sidebarBtn}>
                <PartyPopper size={28} color="#fbbf24" />
                <Text style={styles.sidebarLabel}>PARTY</Text>
              </TouchableOpacity>

              <View style={styles.giftWrapper}>
                <TouchableOpacity onPress={() => setShowGifts(!showGifts)} style={styles.giftBtn}>
                  <MotiView 
                    animate={{ scale: [1, 1.1, 1], rotate: ['0deg', '5deg', '-5deg', '0deg'] }}
                    transition={{ loop: true, duration: 2000 }}
                    style={[styles.giftCircle, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                  >
                    <GiftIcon size={24} color="#fff" />
                  </MotiView>
                  <Text style={styles.sidebarLabel}>GIFT</Text>
                </TouchableOpacity>

                <AnimatePresence>
                  {showGifts && (
                    <MotiView 
                      from={{ opacity: 0, scale: 0.5, translateX: 50 }}
                      animate={{ opacity: 1, scale: 1, translateX: 0 }}
                      exit={{ opacity: 0, scale: 0.5, translateX: 50 }}
                      style={styles.giftMenu}
                    >
                      <BlurView intensity={60} tint="dark" style={styles.giftMenuBlur}>
                        {VIRTUAL_GIFTS.map((gift) => (
                          <TouchableOpacity 
                            key={gift.id}
                            onPress={() => { setShowGifts(false); handleCelebrate(); }}
                            style={styles.giftMenuItem}
                          >
                            <Text style={styles.giftEmoji}>{gift.icon}</Text>
                            <View>
                              <Text style={styles.giftItemLabel}>{gift.label}</Text>
                              <Text style={[styles.giftItemPrice, { color: theme.secondary }]}>{gift.price}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </BlurView>
                    </MotiView>
                  )}
                </AnimatePresence>
              </View>

              <TouchableOpacity onPress={() => setShowShare(true)} style={styles.sidebarBtn}>
                <Share2 size={28} color="#fff" />
                <Text style={styles.sidebarLabel}>SHARE</Text>
              </TouchableOpacity>
            </View>

            {/* Wishes Container */}
            <View style={styles.wishesContainer}>
              <AnimatePresence>
                {wishes.map((wish) => (
                  <MotiView
                    key={wish.id}
                    from={{ opacity: 0, translateX: -20, scale: 0.8 }}
                    animate={{ opacity: 1, translateX: 0, scale: 1 }}
                    exit={{ opacity: 0, translateY: -20, scale: 0.5 }}
                    style={styles.wishBubble}
                  >
                    <View style={[styles.wishDot, { backgroundColor: theme.primary }]} />
                    <Text style={styles.wishText}>
                      <Text style={[styles.wishUser, { color: theme.secondary }]}>{wish.user}</Text> {wish.text}
                    </Text>
                  </MotiView>
                ))}
              </AnimatePresence>
            </View>

            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
              <View style={styles.authorRow}>
                <Text style={styles.authorHandle}>{video.handle}</Text>
                {video.isBirthday && (
                  <View style={styles.birthdayTag}>
                    <Text style={styles.birthdayTagText}>BIRTHDAY</Text>
                  </View>
                )}
              </View>
              <Text style={styles.descText} numberOfLines={2}>{video.description}</Text>
              <View style={styles.footerRow}>
                <BlurView intensity={20} tint="dark" style={styles.musicTag}>
                  <Music size={12} color="#fff" />
                  <Text style={styles.musicText}>{video.music}</Text>
                </BlurView>
                <View style={styles.liveTag}>
                  <Sparkles size={12} color="#fbbf24" />
                  <Text style={styles.liveTagText}>LIVE EVENT</Text>
                </View>
              </View>
            </View>

            {/* Album Disk */}
            <MotiView 
              animate={{ rotate: '360deg' }}
              transition={{ loop: true, type: 'timing', duration: 4000 }}
              style={styles.albumDisk}
            >
              <Image source={{ uri: video.avatar }} style={styles.albumAvatar} />
            </MotiView>
          </View>
        ))}
      </ScrollView>

      {/* Comments Modal - Fixed to not overlap */}
      <AnimatePresence>
        {showComments && (
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              onPress={() => setShowComments(false)} 
            />
            <MotiView
              from={{ translateY: screenHeight }}
              animate={{ translateY: 0 }}
              exit={{ translateY: screenHeight }}
              transition={{ type: 'spring', damping: 20 }}
              style={[styles.commentsModal, { backgroundColor: theme.bg }]}
            >
              <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sheetTitle, { color: theme.text }]}>Comments</Text>
                <TouchableOpacity onPress={() => setShowComments(false)}>
                  <X size={24} color={theme.subText} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.sheetContent}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View key={i} style={styles.commentItem}>
                    <Image source={{ uri: `https://i.pravatar.cc/100?u=${i}` }} style={[styles.commentAvatar, { backgroundColor: theme.itemBg }]} />
                    <View style={styles.commentBody}>
                      <Text style={[styles.commentUser, { color: theme.text }]}>User_{i}</Text>
                      <Text style={[styles.commentText, { color: theme.subText }]}>This celebration looks amazing! 🎉🎂</Text>
                      <View style={styles.commentFooter}>
                        <Text style={[styles.commentTime, { color: theme.subText }]}>2h ago</Text>
                        <Text style={[styles.commentReply, { color: theme.primary }]}>Reply</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.commentLike}>
                      <Heart size={14} color={theme.subText} />
                      <Text style={[styles.commentLikeCount, { color: theme.subText }]}>12</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View style={[styles.sheetInputContainer, { borderTopColor: theme.border, backgroundColor: theme.bg }]}>
                <Image source={{ uri: userProfileImage }} style={[styles.inputAvatar, { backgroundColor: theme.itemBg }]} />
                <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg }]}>
                  <Text style={[styles.inputPlaceholder, { color: theme.subText }]}>Add a comment...</Text>
                </View>
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowShare(false)} />
            <MotiView
              from={{ translateY: screenHeight }}
              animate={{ translateY: 0 }}
              exit={{ translateY: screenHeight }}
              transition={{ type: 'spring', damping: 20 }}
              style={[styles.shareModal, { backgroundColor: theme.bg }]}
            >
              <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sheetTitle, { color: theme.text }]}>Share to</Text>
                <TouchableOpacity onPress={() => setShowShare(false)}>
                  <X size={24} color={theme.subText} />
                </TouchableOpacity>
              </View>
              <View style={styles.shareOptions}>
                {[
                  { name: 'WhatsApp', color: '#25D366' },
                  { name: 'Instagram', color: '#E1306C' },
                  { name: 'Snapchat', color: '#FFFC00' },
                  { name: 'Facebook', color: '#1877F2' },
                  { name: 'Copy Link', color: theme.subText }
                ].map((item) => (
                  <TouchableOpacity key={item.name} style={styles.shareOption} onPress={() => setShowShare(false)}>
                    <View style={[styles.shareIconPlace, { backgroundColor: item.color + '15' }]}>
                      <Share2 size={24} color={item.color} />
                    </View>
                    <Text style={[styles.shareLabel, { color: theme.text }]}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <View style={styles.confettiLayer} pointerEvents="none">
            {[...Array(15)].map((_, i) => (
              <MotiView
                key={i}
                from={{ translateY: -100, translateX: (i * 20), opacity: 1 }}
                animate={{ translateY: height + 100, opacity: 0 }}
                transition={{ duration: 3000, delay: i * 100 }}
                style={styles.confettiItem}
              >
                <Text style={styles.confettiEmoji}>{['🎉', '🎊', '✨', '🎂', '🎈'][Math.floor(Math.random() * 5)]}</Text>
              </MotiView>
            ))}
          </View>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollView: { flex: 1 },
  videoPage: { width: width, height: height, position: 'relative' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  progressBarContainer: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 30, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: 12, gap: 4, zIndex: 200 },
  progressBarBg: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  topBar: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 0, right: 0, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  blurPad: { padding: 10, borderRadius: 25, overflow: 'hidden' },
  navTabs: { flexDirection: 'row', gap: 20 },
  navTab: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
  navTabActive: { color: '#fff', borderBottomWidth: 2, borderBottomColor: '#fff', paddingBottom: 4 },
  topBarRight: { flexDirection: 'row', gap: 12 },
  backBtn: { borderRadius: 12, overflow: 'hidden' },
  cameraBtn: { borderRadius: 12, overflow: 'hidden' },
  muteBtn: { borderRadius: 12, overflow: 'hidden' },
  sidebar: { position: 'absolute', right: 12, bottom: 100, gap: 20, alignItems: 'center', zIndex: 100 },
  authorSection: { alignItems: 'center', marginBottom: 8 },
  sidebarAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' },
  followBadge: { position: 'absolute', bottom: -6, backgroundColor: '#ef4444', borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  sidebarBtn: { alignItems: 'center', gap: 4 },
  sidebarLabel: { color: '#fff', fontSize: 10, fontWeight: '900' },
  giftWrapper: { alignItems: 'center' },
  giftBtn: { alignItems: 'center', gap: 4 },
  giftCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  giftMenu: { position: 'absolute', right: 60, bottom: 0, minWidth: 160, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  giftMenuBlur: { padding: 8 },
  giftMenuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 16 },
  giftEmoji: { fontSize: 24 },
  giftItemLabel: { fontSize: 9, fontWeight: '900', color: '#fff', textTransform: 'uppercase' },
  giftItemPrice: { fontSize: 8, fontWeight: '700', color: '#818cf8', marginTop: 2 },
  wishesContainer: { position: 'absolute', bottom: 180, left: 16, gap: 8, zIndex: 50 },
  wishBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  wishDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4f46e5' },
  wishText: { fontSize: 11, color: '#fff' },
  wishUser: { fontWeight: '900', color: '#818cf8' },
  bottomInfo: { position: 'absolute', bottom: 100, left: 16, right: 80, zIndex: 100 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  authorHandle: { fontSize: 16, fontWeight: '900', color: '#fff' },
  birthdayTag: { backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  birthdayTagText: { fontSize: 8, fontWeight: '900', color: '#fff' },
  descText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 16, fontWeight: '500', marginBottom: 10 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  musicTag: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, overflow: 'hidden' },
  musicText: { color: '#fff', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveTagText: { color: '#fbbf24', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  heartOverlay: { position: 'absolute', zIndex: 1000 },
  albumDisk: { position: 'absolute', left: 16, bottom: 100, width: 36, height: 36, borderRadius: 18, backgroundColor: '#334155', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  albumAvatar: { width: 20, height: 20, borderRadius: 10 },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, justifyContent: 'flex-end' },
  commentsModal: { height: '70%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20 },
  shareModal: { height: '50%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '900', color: '#000' },
  sheetContent: { flex: 1, paddingHorizontal: 20 },
  commentItem: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16 },
  commentBody: { flex: 1 },
  commentUser: { fontSize: 13, fontWeight: '900', marginBottom: 2 },
  commentText: { fontSize: 13, lineHeight: 18 },
  commentFooter: { flexDirection: 'row', gap: 12, marginTop: 4 },
  commentTime: { fontSize: 11 },
  commentReply: { fontSize: 11, fontWeight: '900' },
  commentLike: { alignItems: 'center' },
  commentLikeCount: { fontSize: 10, marginTop: 2 },
  sheetInputContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderTopWidth: 1, paddingBottom: Platform.OS === 'ios' ? 40 : 16 },
  inputAvatar: { width: 32, height: 32, borderRadius: 16 },
  inputWrapper: { flex: 1, height: 40, borderRadius: 20, justifyContent: 'center', paddingHorizontal: 16 },
  inputPlaceholder: { fontSize: 13 },
  shareOptions: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 20, justifyContent: 'center' },
  shareOption: { alignItems: 'center', width: (width - 100) / 3, marginBottom: 20 },
  shareIconPlace: { width: 48, height: 48, borderRadius: 24, marginBottom: 8 },
  shareLabel: { fontSize: 11, fontWeight: '600' },
  confettiLayer: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
  confettiItem: { position: 'absolute' },
  confettiEmoji: { fontSize: 24 },
});
