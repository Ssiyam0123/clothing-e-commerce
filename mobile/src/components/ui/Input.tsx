import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

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
        <Text className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
          {label}
        </Text>
      ) : null}
      
      <View
        className={`w-full flex-row items-center border rounded-xl bg-white dark:bg-zinc-900 ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-primary dark:border-white'
            : 'border-slate-200 dark:border-zinc-800'
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
          className={`flex-1 py-3.5 px-4 text-foreground font-medium text-base ${className}`}
          placeholderTextColor="#94A3B8"
          {...props}
        />
        
        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="px-4 py-3.5"
          >
            {showPassword ? (
              <EyeOff size={20} className="text-slate-400 dark:text-zinc-500" />
            ) : (
              <Eye size={20} className="text-slate-400 dark:text-zinc-500" />
            )}
          </Pressable>
        ) : null}
      </View>
      
      {error ? (
        <Text className="text-xs font-medium text-red-500 mt-1">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
