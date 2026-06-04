import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAppStore } from '../../store/appStore';
import { getBrandTokens } from '../../constants/designSystem';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  containerClassName?: string;
  className?: string;
}

export function Input({
  label,
  error,
  isPassword = false,
  containerClassName = '',
  className = '',
  secureTextEntry,
  style: inputStyle,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useAppStore((s) => s.theme);
  const palette = getBrandTokens(theme);
  const borderColor = error ? palette.danger : isFocused ? palette.accent : palette.border;

  return (
    <View className={`w-full mb-4 ${containerClassName}`}>
      {label ? (
        <Text className="mb-1.5 text-[10px] font-black uppercase tracking-wider" style={{ color: palette.textSecondary }}>
          {label}
        </Text>
      ) : null}
      
      <View
        className={`w-full flex-row items-center rounded-field border bg-input ${
          error
            ? 'border-danger'
            : isFocused
            ? 'border-ring'
            : 'border-border'
        }`}
        style={{ backgroundColor: palette.surface, borderColor }}
      >
        <TextInput
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          secureTextEntry={isPassword && !showPassword}
          className={`flex-1 px-4 py-3.5 text-sm font-semibold ${className}`}
          style={[{ color: palette.text }, inputStyle]}
          placeholderTextColor={palette.iconMuted}
          {...props}
        />
        
        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="px-4 py-3.5"
          >
            {showPassword ? (
              <EyeOff size={20} color={palette.iconMuted} />
            ) : (
              <Eye size={20} color={palette.iconMuted} />
            )}
          </Pressable>
        ) : null}
      </View>
      
      {error ? (
        <Text className="mt-1 text-xs font-semibold" style={{ color: palette.danger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
