import React from 'react';
import { View, Text } from 'react-native';
import { useAppStore } from '../../store/appStore';

export function MobileSectionHeader({ section }: { config?: any; section?: any }) {
  const lang = useAppStore((s) => s.lang);
  const title =
    lang === 'bn' && section?.titleBn ? section.titleBn : section?.title || '';
  const subtitle =
    lang === 'bn' && section?.subtitleBn
      ? section.subtitleBn
      : section?.subtitle || '';

  if (!title) return null;

  return (
    <View className="px-4 mt-2 mb-3">
      <Text className="text-[22px] font-black text-foreground uppercase tracking-tight leading-[26px]">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-[12px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-[16px]">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
