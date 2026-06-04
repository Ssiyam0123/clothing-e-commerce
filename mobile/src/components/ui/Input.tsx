import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

const placeholderColor = '#8D7B68';

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
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`w-full mb-4 ${containerClassName}`}>
      {label ? (
        <Text className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
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
          className={`flex-1 px-4 py-3.5 text-sm font-semibold text-main ${className}`}
          placeholderTextColor={placeholderColor}
          {...props}
        />
        
        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="px-4 py-3.5"
          >
            {showPassword ? (
              <EyeOff size={20} className="text-muted-foreground" />
            ) : (
              <Eye size={20} className="text-muted-foreground" />
            )}
          </Pressable>
        ) : null}
      </View>
      
      {error ? (
        <Text className="mt-1 text-xs font-semibold text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
