import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, FlatList, RefreshControl, Modal,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { helpdeskApi } from '../api/helpdesk';

export default function HelpdeskScreen() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('OPEN');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loadingReplies, setLoadingReplies] = useState(false);

  const loadTickets = useCallback(async () => {
    try {
      const data = await helpdeskApi.getTicketsByStatus(filter);
      setTickets(data);
    } catch (err) {
      setTickets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const handleResolve = async (id) => {
    try {
      await helpdeskApi.resolveTicket(id);
      loadTickets();
    } catch (err) {
      alert('Failed to resolve: ' + err.message);
    }
  };

  const openTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setReplyText('');
    setLoadingReplies(true);
    try {
      const data = await helpdeskApi.getReplies(ticket.id);
      setReplies(data);
    } catch {
      setReplies([]);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    try {
      await helpdeskApi.addReply(selectedTicket.id, user.userId, replyText.trim());
      setReplyText('');
      const data = await helpdeskApi.getReplies(selectedTicket.id);
      setReplies(data);
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity style={styles.ticketCard} onPress={() => openTicket(item)}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketSubject}>{item.subject}</Text>
        <View style={[styles.statusBadge, item.status === 'OPEN' ? styles.statusOpen : styles.statusResolved]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.ticketDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.ticketFooter}>
        <Text style={styles.ticketMeta}>Ticket #{item.id}</Text>
        <Text style={styles.ticketMeta}>Student: {item.studentId}</Text>
        {item.assignedToUserId && (
          <Text style={styles.ticketMeta}>Assigned: #{item.assignedToUserId}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Helpdesk</Text>
          <Text style={styles.headerSubtitle}>{user?.fullName || 'Helpdesk'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {['OPEN', 'RESOLVED'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterTab, filter === status && styles.filterTabActive]}
            onPress={() => { setFilter(status); setLoading(true); }}
          >
            <Text style={[styles.filterTabText, filter === status && styles.filterTabTextActive]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ticket list */}
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicket}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No {filter.toLowerCase()} tickets</Text>
            </View>
          }
        />
      )}

      {/* Ticket detail modal */}
      <Modal
        visible={!!selectedTicket}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTicket(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTicket && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedTicket.subject}</Text>
                  <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                    <Text style={styles.closeBtn}>Close</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDesc}>{selectedTicket.description}</Text>
                <Text style={styles.modalMeta}>Student ID: {selectedTicket.studentId}</Text>
                <Text style={styles.modalMeta}>Status: {selectedTicket.status}</Text>

                {/* Replies */}
                <Text style={styles.repliesTitle}>Replies</Text>
                {loadingReplies ? (
                  <ActivityIndicator size="small" color="#0ea5e9" style={{ marginVertical: 12 }} />
                ) : replies.length === 0 ? (
                  <Text style={styles.noReplies}>No replies yet</Text>
                ) : (
                  replies.map((r) => (
                    <View key={r.id} style={styles.replyItem}>
                      <Text style={styles.replyUser}>User #{r.repliedByUserId}</Text>
                      <Text style={styles.replyMsg}>{r.message}</Text>
                    </View>
                  ))
                )}

                {/* Reply input */}
                <View style={styles.replyRow}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Type a reply..."
                    placeholderTextColor="#94a3b8"
                    value={replyText}
                    onChangeText={setReplyText}
                    multiline
                  />
                  <TouchableOpacity style={styles.sendBtn} onPress={handleReply}>
                    <Text style={styles.sendBtnText}>Send</Text>
                  </TouchableOpacity>
                </View>

                {/* Resolve button */}
                {selectedTicket.status === 'OPEN' && (
                  <TouchableOpacity
                    style={styles.resolveBtn}
                    onPress={() => { handleResolve(selectedTicket.id); setSelectedTicket(null); }}
                  >
                    <Text style={styles.resolveBtnText}>Mark as Resolved</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  logoutBtn: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#1e293b', borderRadius: 8 },
  logoutText: { color: '#94a3b8', fontSize: 14 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 10 },
  filterTab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1e293b' },
  filterTabActive: { backgroundColor: '#0ea5e9' },
  filterTabText: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },
  filterTabTextActive: { color: '#fff' },
  list: { padding: 20, paddingTop: 4 },
  ticketCard: {
    backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketSubject: { fontSize: 16, fontWeight: '600', color: '#fff', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusOpen: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  statusResolved: { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  ticketDesc: { fontSize: 14, color: '#94a3b8', marginBottom: 10 },
  ticketFooter: { flexDirection: 'row', gap: 16 },
  ticketMeta: { fontSize: 12, color: '#64748b' },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: '#64748b', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#1e293b', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, maxHeight: '85%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1 },
  closeBtn: { color: '#0ea5e9', fontSize: 15 },
  modalDesc: { fontSize: 14, color: '#cbd5e1', marginBottom: 8 },
  modalMeta: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  repliesTitle: { fontSize: 15, fontWeight: '600', color: '#fff', marginTop: 16, marginBottom: 8 },
  noReplies: { color: '#64748b', fontSize: 13, marginBottom: 12 },
  replyItem: { backgroundColor: '#0f172a', borderRadius: 8, padding: 12, marginBottom: 8 },
  replyUser: { fontSize: 12, color: '#0ea5e9', marginBottom: 4 },
  replyMsg: { fontSize: 14, color: '#cbd5e1' },
  replyRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  replyInput: {
    flex: 1, backgroundColor: '#0f172a', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#334155', maxHeight: 80,
  },
  sendBtn: { backgroundColor: '#0ea5e9', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  resolveBtn: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#22c55e',
  },
  resolveBtnText: { color: '#22c55e', fontSize: 15, fontWeight: '600' },
});
