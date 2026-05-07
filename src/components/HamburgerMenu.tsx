import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export default function HamburgerMenu({ visible, onClose, onNavigate }: HamburgerMenuProps) {
  const handleLogout = async () => {
    onClose();
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout failed', error.message);
    }
    // AppNavigator detects session === null and switches to SignIn automatically
  };

  const menuItems = [
    { id: 'settings', label: 'Settings', screen: 'Settings' },
    { id: 'notes', label: 'Notes', screen: 'Main' },
    { id: 'quiz', label: 'Quiz', screen: 'QuizList' },
    { id: 'archives', label: 'Archives', screen: 'Archives' },
    { id: 'trash', label: 'Trash', screen: 'Trash' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              {menuItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    onNavigate(item.screen);
                    onClose();
                  }}
                >
                  <Text style={styles.menuItemText}>• {item.label}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.profileBtn} onPress={handleLogout}>
                <Text style={styles.profileIcon}>👤</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
    top: 60, // Adjust based on header height
    left: 50, // Positioned to the right of the hamburger icon
    width: 200,
    backgroundColor: '#D8F4F8',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    backgroundColor: '#EAF9FB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A8E6EF',
  },
  menuItemText: {
    fontSize: 14,
    color: '#0B4A8E',
    fontWeight: '500',
  },
  profileBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B4A8E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileIcon: {
    fontSize: 24,
    color: '#8BBDD9',
  },
});
