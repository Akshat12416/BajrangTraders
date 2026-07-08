import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import dummyLedger from '../../data/dummyLedger.json';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LedgerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { summary, transactions } = dummyLedger;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Text className="text-title font-bold text-textPrimary">Ledger & Account</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-[#F2F3F2] items-center justify-center">
          <Ionicons name="filter" size={20} color="#181725" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Outstanding Summary Card */}
        <View className="mx-6 bg-[#1A6EB4] rounded-2xl p-6 mb-8 shadow-sm shadow-black/10">
          <Text className="text-white/80 text-label mb-1">Total Outstanding</Text>
          <Text className="text-white text-heading font-bold mb-4">₹{summary.totalOutstanding}</Text>
          
          <View className="flex-row justify-between pt-4 border-t border-white/20">
            <View>
              <Text className="text-white/80 text-[10px] mb-1">Credit Limit</Text>
              <Text className="text-white font-semibold">₹{summary.creditLimit}</Text>
            </View>
            <View className="items-end">
              <Text className="text-white/80 text-[10px] mb-1">Overdue Amount</Text>
              <Text className="text-white font-semibold text-[#FFB3B3]">₹{summary.overdue}</Text>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <View className="px-6">
          <Text className="text-title-sm font-bold text-textPrimary mb-4">Recent Transactions</Text>
          
          <View className="bg-white rounded-2xl border border-[#F2F3F2] overflow-hidden shadow-sm shadow-black/5">
            {transactions.map((txn, index) => (
              <View 
                key={txn.id} 
                className={`p-4 flex-row justify-between items-center ${index !== transactions.length - 1 ? 'border-b border-[#F2F3F2]' : ''}`}
              >
                <View className="flex-1 mr-4">
                  <Text className="text-body font-semibold text-textPrimary mb-1">{txn.description}</Text>
                  <Text className="text-label text-textSecondary">
                    {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className={`text-body font-bold mb-1 ${txn.type === 'credit' ? 'text-success' : 'text-error'}`}>
                    {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount}
                  </Text>
                  <Text className="text-label text-textSecondary">Bal: ₹{txn.balance}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Gradient fade at bottom - Blinkit style */}
      <LinearGradient
        colors={['transparent', 'rgba(248,248,248,0.85)', '#F8F8F8']}
        locations={[0, 0.45, 1]}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 }}
        pointerEvents="none"
      />
    </View>
  );
}
