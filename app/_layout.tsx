import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrivyProvider } from '@privy-io/react-auth';

const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID || '';

export default function RootLayout() {
  return (
    <PrivyProvider appId={PRIVY_APP_ID}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack />
      </SafeAreaView>
    </PrivyProvider>
  );
}
