import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { I18nProvider, useI18n } from './src/i18n/i18n';
import { AppProvider } from './src/store/AppState';
import { colors, gradients, shadow } from './src/theme/theme';

import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import ScanScreen from './src/screens/ScanScreen';
import RobotScreen from './src/screens/RobotScreen';
import PassportScreen from './src/screens/PassportScreen';
import QuizScreen from './src/screens/QuizScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_META = {
  Home: { icon: 'home-variant', tKey: 'tab_home' },
  Map: { icon: 'map-marker-radius', tKey: 'tab_map' },
  Passport: { icon: 'card-account-details-outline', tKey: 'tab_passport' },
  Profile: { icon: 'account-circle-outline', tKey: 'tab_profile' },
};

function CustomTabBar({ state, navigation }) {
  const { t } = useI18n();

  const go = (routeName, isFocused, key) => {
    Haptics.selectionAsync().catch(() => {});
    const event = navigation.emit({ type: 'tabPress', target: key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) navigation.navigate(routeName);
  };

  // Порядок: Home, Map, [Scan FAB], Passport, Profile
  const left = state.routes.filter((r) => r.name === 'Home' || r.name === 'Map');
  const right = state.routes.filter((r) => r.name === 'Passport' || r.name === 'Profile');
  const scanRoute = state.routes.find((r) => r.name === 'Scan');
  const focusedName = state.routes[state.index].name;

  const renderTab = (route) => {
    const isFocused = focusedName === route.name;
    const meta = TAB_META[route.name];
    return (
      <Pressable key={route.key} style={styles.tabItem} onPress={() => go(route.name, isFocused, route.key)}>
        <MaterialCommunityIcons
          name={meta.icon}
          size={25}
          color={isFocused ? colors.green600 : colors.textFaint}
        />
        <Text style={[styles.tabLabel, { color: isFocused ? colors.green600 : colors.textFaint }]}>
          {t(meta.tKey)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.tabBarWrap}>
      <View style={styles.tabBar}>
        {left.map(renderTab)}

        {/* Центральная кнопка сканера */}
        <View style={styles.fabSlot}>
          <Pressable
            onPress={() => go('Scan', focusedName === 'Scan', scanRoute.key)}
            style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.94 : 1 }] }]}
          >
            <LinearGradient colors={gradients.mint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fab}>
              <MaterialCommunityIcons name="line-scan" size={28} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>

        {right.map(renderTab)}
      </View>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Passport" component={PassportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AppProvider>
          <StatusBar style="auto" />
          <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Tabs" component={Tabs} />
              <Stack.Screen
                name="Robot"
                component={RobotScreen}
                options={{ presentation: 'card', animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="Quiz"
                component={QuizScreen}
                options={{ presentation: 'card', animation: 'slide_from_right' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 26 : 14,
    paddingTop: 4,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 26,
    height: 66,
    paddingHorizontal: 8,
    ...shadow.float,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabLabel: { fontSize: 10.5, fontWeight: '700' },
  fabSlot: { width: 72, alignItems: 'center', justifyContent: 'center' },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    borderWidth: 4,
    borderColor: colors.bg,
    ...shadow.card,
  },
});
