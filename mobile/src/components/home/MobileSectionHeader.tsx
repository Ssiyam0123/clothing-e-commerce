import React from 'react';
import { View, Text } from 'react-native';
import { useAppStore } from '../../store/appStore';
import { getBrandScheme } from '../../constants/designSystem';

export function MobileSectionHeader({ section }: { config?: any; section?: any }) {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const colors = getBrandScheme(theme);
  const title =
    lang === 'bn' && section?.titleBn ? section.titleBn : section?.title || '';
  const subtitle =
    lang === 'bn' && section?.subtitleBn
      ? section.subtitleBn
      : section?.subtitle || '';

  if (!title) return null;

  return (
    <View className="mb-3 mt-2 px-4">
      <Text
        className="text-[22px] font-black uppercase leading-[26px] tracking-tight"
        style={{ color: colors.text }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="mt-1 text-[12px] font-semibold leading-[16px]"
          style={{ color: colors.textSecondary }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
