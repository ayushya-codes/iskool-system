import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Vibration,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { safetyApi } from '../api/safety';

export default function GateKeeperScreen() {
  const { user, logout } = useAuth();
  const [passCode, setPassCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const handleVerify = async () => {
    if (!passCode.trim()) return;
    setVerifying(true);
    setLastResult(null);
    try {
      const result = await safetyApi.verifyGatePass(passCode.trim(), today);
      setLastResult({ success: true, data: result });
      Vibration.vibrate(100);
      setPassCode('');
    } catch (err) {
      setLastResult({ success: false, message: err.message || 'Invalid gate pass' });
      Vibration.vibrate([100, 50, 100]);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gate Keeper</Text>
          <Text style={styles.headerSubtitle}>{user?.fullName || 'Guard'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Scanner area */}
      <View style={styles.scannerArea}>
        <View style={styles.scannerFrame}>
          <Text style={styles.scannerIcon}>Scan QR</Text>
          <Text style={styles.scannerHint}>or enter pass code manually below</Text>
        </View>
      </View>

      {/* Manual entry */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Pass Code</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter pass code"
            placeholderTextColor="#94a3b8"
            value={passCode}
            onChangeText={setPassCode}
            autoCapitalize="characters"
            onSubmitEditing={handleVerify}
          />
          <TouchableOpacity
            style={[styles.verifyBtn, !passCode.trim() && styles.verifyBtnDisabled]}
            onPress={handleVerify}
            disabled={!passCode.trim() || verifying}
          >
            {verifying ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.verifyBtnText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Result */}
      {lastResult && (
        <View style={[styles.resultCard, lastResult.success ? styles.resultSuccess : styles.resultError]}>
          {lastResult.success ? (
            <>
              <Text style={styles.resultTitle}>Gate Pass Verified</Text>
              <Text style={styles.resultDetail}>Student ID: {lastResult.data.studentId}</Text>
              <Text style={styles.resultDetail}>Date: {lastResult.data.validDate}</Text>
              <Text style={styles.resultDetail}>Status: Used</Text>
            </>
          ) : (
            <Text style={styles.resultTitle}>{lastResult.message}</Text>
          )}
        </View>
      )}

      {/* Date footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Today: {today}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  logoutText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  scannerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scannerFrame: {
    width: 240,
    height: 240,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  scannerHint: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  label: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  verifyBtn: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnDisabled: {
    opacity: 0.5,
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  resultSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  resultError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  resultDetail: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
});
