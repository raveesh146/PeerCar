import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { CarDataProvider } from "./contexts/CarDataContext";
import { WalletProvider } from "./contexts/WalletContext";

export default function RootLayout() {
  return (
    <WalletProvider>
      <CarDataProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </CarDataProvider>
    </WalletProvider>
  );
}
