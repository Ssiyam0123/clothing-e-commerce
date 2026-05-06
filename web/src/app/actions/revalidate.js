"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function revalidateSettings() {
  try {
    revalidateTag("settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Revalidation error:", error);
    return { success: false, error: error.message };
  }
}

export async function revalidateHome() {
  try {
    revalidateTag("home-data");
    revalidateTag("banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Revalidation error:", error);
    return { success: false, error: error.message };
  }
}
