import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';

interface FormInputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  error?: string;
}

export default function FormInput({ label, containerStyle, error, ...rest }: FormInputProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#8BBDD9"
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B4A8E',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#EAF9FB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0B4A8E',
  },
  inputError: {
    borderColor: '#E05C5C',
  },
  error: {
    color: '#E05C5C',
    fontSize: 11,
    marginTop: 4,
  },
});
