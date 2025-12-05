import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useBiometric } from '../hooks/useBiometric';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Profile Screen with Biometric Toggle
 */

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isAvailable: biometricAvailable, authenticate } = useBiometric();

  const user = useSelector((state: RootState) => state.auth.user);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    loadBiometricPreference();
  }, []);

  const loadBiometricPreference = async () => {
    const enabled = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
    setBiometricEnabled(enabled === 'true');
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      try {
        const success = await authenticate('Enable Biometric Authentication', 'Verify your identity to enable biometric login');

        if (success) {
          setBiometricEnabled(true);
          await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
          Alert.alert('Success', 'Biometric authentication enabled');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    } else {
      setBiometricEnabled(false);
      await AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      {/* User Info */}
      <View style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </Text>
        </View>

        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{user?.email}</Text>
      </View>

      {/* Settings */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Security</Text>

        {biometricAvailable && (
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="finger-print-outline" size={24} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Biometric Login</Text>
            </View>
            <Switch value={biometricEnabled} onValueChange={handleBiometricToggle} trackColor={{ false: theme.colors.border, true: theme.colors.primary }} thumbColor="#FFFFFF" />
          </View>
        )}

        <Pressable style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Icon name="key-outline" size={24} color={theme.colors.text} />
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Change Password</Text>
          </View>
          <Icon name="chevron-forward" size={24} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      {/* Preferences */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferences</Text>

        <Pressable style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Icon name="notifications-outline" size={24} color={theme.colors.text} />
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Notifications</Text>
          </View>
          <Icon name="chevron-forward" size={24} color={theme.colors.textSecondary} />
        </Pressable>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Icon name={theme.isDark ? 'moon' : 'sunny'} size={24} color={theme.colors.text} />
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Theme: {theme.isDark ? 'Dark' : 'Light'}</Text>
          </View>
          <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>Auto</Text>
        </View>
      </View>

      {/* Logout */}
      <Pressable style={[styles.logoutButton, { backgroundColor: theme.colors.error }]} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  userCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default ProfileScreen;
