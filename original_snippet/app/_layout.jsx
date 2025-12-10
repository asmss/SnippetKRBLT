import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/authContext";
import {SnippetProvider} from "../context/snippetContext"
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <SnippetProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
      </SnippetProvider>
    </AuthProvider>
  );
}
