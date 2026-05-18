import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetchSettings, clientUpdateSettings } from "./settings";
import { swalSuccess, swalError } from "@/utils/swal";
import { revalidateSettings } from "@/app/actions/revalidate";
import { useAppStore } from "@/store/appStore";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ["site-settings"],
    queryFn: clientFetchSettings,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection for 24 hours
  });

  //  DEBUG: Console log settings for the user
  if (typeof window !== 'undefined' && settings) {
    console.log("⚙️ [PROTOCOL SETTINGS]:", settings);
  }

  const updateSettings = useMutation({
    mutationFn: clientUpdateSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      revalidateSettings();

      // ✅ Sync with Global App Store for instant site-wide theme update
      const branding = data?.settings?.branding || {};
      const store = useAppStore.getState();
      if (branding.defaultTheme) store.setTheme(branding.defaultTheme);
      if (branding.defaultThemeColor) store.setThemeColor(branding.defaultThemeColor);
      if (branding.activeTheme) store.setIdentityTheme(branding.activeTheme);
      if (branding.defaultLanguage) store.setLang(branding.defaultLanguage);

      swalSuccess("Success", "Site protocol updated effectively.");
    },
    onError: (err) => {
      swalError(
        "Update Failed",
        err.response?.data?.message || "Something went wrong",
      );
    },
  });

  return {
    settings,
    isLoading,
    refetch,
    updateSettings: updateSettings.mutateAsync,
    isUpdating: updateSettings.isPending,
  };
};
