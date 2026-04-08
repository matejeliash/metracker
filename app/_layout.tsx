import { Stack } from "expo-router";
import { defaultForegroundColor, defaultTextColor, ThemeProvider } from "./styles";

export default function RootLayout() {

  return (

    // put stack inside so every component can access useTheme()
    <ThemeProvider>
      <Stack

        screenOptions={{
          headerStyle: {
            backgroundColor: defaultForegroundColor,
          },
          headerShadowVisible: true,
          headerTintColor: defaultTextColor,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="details"

          options={{
            title: 'Selected date tasks',
            // presentation: 'modal' // Optional: makes it slide up like a sheet
          }}
        />


      </Stack>
    </ThemeProvider>
  );
}
