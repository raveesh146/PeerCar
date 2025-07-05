import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { WalletProvider } from "./contexts/WalletContext";

export default function RootLayout() {
  return (
    <WalletProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack />
      </SafeAreaView>
    </WalletProvider>
  );
}
