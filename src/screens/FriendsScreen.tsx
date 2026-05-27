import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Modal, Alert, FlatList } from "react-native";
import { ArrowLeft, Search, UserPlus, UserCheck, X, MessageCircle, MoreHorizontal, Settings } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { Friend, FriendRequest } from "../types";

interface FriendsScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string, id?: string) => void;
  friends: Friend[];
  friendRequests: FriendRequest[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onRemoveFriend: (friendId: string) => void;
  onSendFriendRequest: (userId: string) => void;
  onBlockUser: (userId: string) => void;
  currentUserId: string;
}

export default function FriendsScreen({
  onBack,
  onNavigate,
  friends,
  friendRequests,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend,
  onSendFriendRequest,
  onBlockUser,
  currentUserId
}: FriendsScreenProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingRequests = friendRequests.filter(r => r.toUserId === currentUserId && r.status === 'pending');

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={[styles.friendCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.friendUsername, { color: theme.subText }]}>{item.username}</Text>
      </View>
      <View style={styles.friendActions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.itemBg }]} onPress={() => setSelectedFriend(item)}>
          <MoreHorizontal size={18} color={theme.subText} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.messageBtn, { backgroundColor: theme.primary }]}>
          <MessageCircle size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRequestItem = ({ item }: { item: FriendRequest }) => (
    <View style={[styles.requestCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.fromUserAvatar }} style={styles.requestAvatar} />
      <View style={styles.requestInfo}>
        <Text style={[styles.requestName, { color: theme.text }]}>{item.fromUserName}</Text>
        <Text style={[styles.requestTime, { color: theme.subText }]}>{item.timestamp}</Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity style={[styles.acceptBtn, { backgroundColor: theme.primary }]} onPress={() => onAcceptRequest(item.id)}>
          <UserCheck size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rejectBtn, { backgroundColor: theme.itemBg }]} onPress={() => onRejectRequest(item.id)}>
          <X size={16} color={theme.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Friends</Text>
        <TouchableOpacity onPress={() => onNavigate && onNavigate('privacy_settings')} style={styles.settingsBtn}>
          <Settings size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        {[
          { id: 'friends', label: `Friends (${acceptedFriends.length})`, icon: UserCheck },
          { id: 'requests', label: `Requests (${pendingRequests.length})`, icon: UserPlus },
          { id: 'search', label: 'Search', icon: Search },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id as any)}
            style={[styles.tab, activeTab === tab.id && styles.tabActive, { borderBottomColor: activeTab === tab.id ? theme.primary : 'transparent' }]}
          >
            <tab.icon size={16} color={activeTab === tab.id ? theme.primary : theme.subText} />
            <Text style={[styles.tabLabel, { color: activeTab === tab.id ? theme.primary : theme.subText }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {activeTab === 'friends' && acceptedFriends.length === 0 && (
          <View style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <UserCheck size={48} color={theme.subText} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Friends Yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.subText }]}>Search for friends to connect with</Text>
          </View>
        )}
        {activeTab === 'friends' && acceptedFriends.length > 0 && (
          <FlatList data={acceptedFriends} keyExtractor={(item) => item.id} renderItem={renderFriendItem} scrollEnabled={false} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} />
        )}

        {activeTab === 'requests' && pendingRequests.length === 0 && (
          <View style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <UserPlus size={48} color={theme.subText} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Friend Requests</Text>
            <Text style={[styles.emptySubtitle, { color: theme.subText }]}>When someone adds you, it will appear here</Text>
          </View>
        )}
        {activeTab === 'requests' && pendingRequests.length > 0 && (
          <FlatList data={pendingRequests} keyExtractor={(item) => item.id} renderItem={renderRequestItem} scrollEnabled={false} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} />
        )}

        {activeTab === 'search' && (
          <View>
            <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Search size={18} color={theme.subText} />
              <TextInput placeholder="Search by name..." placeholderTextColor={theme.subText} style={[styles.searchInput, { color: theme.text }]} value={searchQuery} onChangeText={setSearchQuery} />
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={!!selectedFriend} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setSelectedFriend(null)} />
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Image source={{ uri: selectedFriend?.avatar }} style={styles.modalAvatar} />
            <Text style={[styles.modalName, { color: theme.text }]}>{selectedFriend?.name}</Text>
            <TouchableOpacity style={[styles.modalOption, { borderBottomColor: theme.border }]} onPress={() => { setSelectedFriend(null); Alert.alert("Remove Friend", "Are you sure?", [{ text: "Cancel" }, { text: "Remove", onPress: () => selectedFriend && onRemoveFriend(selectedFriend.id) }]); }}>
              <Text style={[styles.modalOptionText, { color: '#ef4444' }]}>Remove Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalOption, styles.modalCancel]} onPress={() => setSelectedFriend(null)}>
              <Text style={[styles.modalOptionText, { color: theme.subText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1 },
  backBtn: { padding: 8, borderRadius: 20 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  settingsBtn: { padding: 8, borderRadius: 20 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderBottomWidth: 2 },
  tabActive: { borderBottomWidth: 2 },
  tabLabel: { fontSize: 12, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  friendCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
  friendAvatar: { width: 52, height: 52, borderRadius: 26 },
  friendInfo: { flex: 1 },
  friendName: { fontSize: 16, fontWeight: '900' },
  friendUsername: { fontSize: 12, marginTop: 2 },
  friendActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  messageBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  requestCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
  requestAvatar: { width: 52, height: 52, borderRadius: 26 },
  requestInfo: { flex: 1 },
  requestName: { fontSize: 16, fontWeight: '900' },
  requestTime: { fontSize: 11, marginTop: 2 },
  requestActions: { flexDirection: 'row', gap: 8 },
  acceptBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, height: 48, borderRadius: 24, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500' },
  emptyContainer: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 24, borderWidth: 1, borderStyle: 'dashed' },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 28, padding: 24, alignItems: 'center', gap: 8 },
  modalAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  modalName: { fontSize: 20, fontWeight: '900' },
  modalOption: { width: '100%', paddingVertical: 14, alignItems: 'center', borderBottomWidth: 1 },
  modalCancel: { borderBottomWidth: 0, marginTop: 8 },
  modalOptionText: { fontSize: 16, fontWeight: '600' },
});
