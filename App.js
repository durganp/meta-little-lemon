import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet } from 'react-native';
import Onboarding from './screens/Onboarding';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useReducer, useState } from 'react';
import Home from './screens/Home';
import { AppContext } from './AppContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'onboard':
          return {
            ...prevState,

            isOnboardingCompleted: action.isOnboardingCompleted,
          };
      }
    },
    {
      isOnboardingCompleted: true,
    }
  );

  useEffect(() => {
    (async () => {
      let profileData = [];
      try {
        const getProfile = await AsyncStorage.getItem('profile');
        if (getProfile !== null) {
          profileData = getProfile;
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (Object.keys(profileData).length != 0) {
          dispatch({ type: 'onboard', isOnboardingCompleted: true });
        } else {
          dispatch({ type: 'onboard', isOnboardingCompleted: false });
        }
      }
    })();
  }, []);
  const memoContext = useMemo(
    () => ({
      onboard: async (data) => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem('profile', jsonValue);
        } catch (e) {
          console.error(e);
        }

        dispatch({ type: 'onboard', isOnboardingCompleted: true });
      },
      update: async (data) => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem('profile', jsonValue);
        } catch (e) {
          console.error(e);
        }
      },
      logout: async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.error(e);
        }

        dispatch({ type: 'onboard', isOnboardingCompleted: false });
      },
    }),
    []
  );

  return (
    <AppContext.Provider value={memoContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.isOnboardingCompleted ? (
            <>
              <Stack.Screen name="home" component={Home} />
              <Stack.Screen name="profile" component={Profile} />
            </>
          ) : (
            <Stack.Screen name="onboarding" component={Onboarding} />
          )}
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
