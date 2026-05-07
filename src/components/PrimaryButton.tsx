import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'solid' | 'outline';
}

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'solid',
}: PrimaryButtonProps) {
  const isSolid = variant === 'solid';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSolid ? styles.solid : styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? '#fff' : '#0B4A8E'} />
      ) : (
        <Text style={[styles.label, isSolid ? styles.labelSolid : styles.labelOutline, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: '#0B4A8E',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#0B4A8E',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  labelSolid: {
    color: '#fff',
  },
  labelOutline: {
    color: '#0B4A8E',
  },
});
