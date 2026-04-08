import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useTheme } from '../styles';





export default function TabLayout() {


  const {
    primaryColor,
    foregroundColor,
    textColor,
  } = useTheme();

  return (

    // general tabs styling
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: foregroundColor,
        },
        headerShadowVisible: true,
        headerTintColor: textColor,
        tabBarStyle: {
          backgroundColor: foregroundColor,
          height: 80
        },

        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: textColor
      }}
    >
      {/* individual tabs , use icon and active tab uses primary color*/}
      <Tabs.Screen
        name="index"
        options={{
          title: 'metracker',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar-sharp' : 'calendar-outline'} color={color} size={26} />
          ),

        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings-sharp' : 'settings-outline'} color={color} size={26} />
          ),

        }}
      />
    </Tabs>
  );
}
