import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getLedgerHistory } from '../../services/ledgerService';

export default function LedgerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLedgerHistory();
      setTransactions(data);
    } catch (err) {
      setError(err.message || 'Failed to load ledger history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Text className="text-title font-bold text-textPrimary">Ledger & Account</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-[#F2F3F2] items-center justify-center">
          <Ionicons name="filter" size={20} color="#181725" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1A6EB4" />
          <Text className="text-body text-textSecondary mt-4">Loading Ledger...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-error text-center mb-4 text-body">{error}</Text>
          <TouchableOpacity onPress={fetchLedger} className="bg-[#1A6EB4] px-6 py-3 rounded-full">
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Note: Outstanding Summary Card has been temporarily hidden because Marg Corporate EDE API 
              only returns a list of transactions, not a total balance or credit limit. */}

          {/* Transactions List */}
          <View className="px-6 mt-4">
            <Text className="text-title-sm font-bold text-textPrimary mb-4">Recent Transactions</Text>
            
            {transactions.length === 0 ? (
              <View className="bg-white rounded-2xl border border-[#F2F3F2] p-8 items-center justify-center">
                <Ionicons name="receipt-outline" size={48} color="#E2E2E2" />
                <Text className="text-body text-textSecondary mt-4 text-center">
                  No transactions found for this account.
                </Text>
              </View>
            ) : (
              <View className="bg-white rounded-2xl border border-[#F2F3F2] overflow-hidden shadow-sm shadow-black/5">
                {transactions.map((txn, index) => (
                  <View 
                    key={txn.id + index} 
                    className={`p-4 flex-row justify-between items-center ${index !== transactions.length - 1 ? 'border-b border-[#F2F3F2]' : ''}`}
                  >
                    <View className="flex-1 mr-4">
                      <Text className="text-body font-semibold text-textPrimary mb-1">{txn.description}</Text>
                      <Text className="text-label text-textSecondary">
                        {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className={`text-body font-bold mb-1 ${txn.voucherType === 'R' || txn.voucherType === 'Receipt' ? 'text-success' : 'text-error'}`}>
                        {txn.voucherType === 'R' || txn.voucherType === 'Receipt' ? '+' : '-'} ₹{txn.amount}
                      </Text>
                      {/* Balance is omitted since API doesn't provide running balance per row */}
                      <Text className="text-[10px] text-textSecondary mt-1">
                        {txn.voucherType === 'S' ? 'Sale' : txn.voucherType === 'R' ? 'Return/Receipt' : txn.voucherType}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Gradient fade at bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(248,248,248,0.85)', '#F8F8F8']}
        locations={[0, 0.45, 1]}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 }}
        pointerEvents="none"
      />
    </View>
  );
}
