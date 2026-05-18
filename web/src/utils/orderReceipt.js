import api from "@/lib/api";

const parseBlobError = async (blob) => {
  try {
    const text = await blob.text();
    const data = JSON.parse(text);
    return data.message || "Download failed";
  } catch {
    return "Download failed";
  }
};

const filenameFromDisposition = (disposition, fallback) => {
  if (!disposition) return fallback;
  const match = disposition.match(/filename="?([^"]+)"?/);
  return match?.[1] || fallback;
};

export async function downloadOrderReceipt(orderId, phone = null) {
  if (!orderId) throw new Error("Order ID is required");

  const url = phone
    ? `/orders/${orderId}/report?phone=${encodeURIComponent(phone)}`
    : `/orders/${orderId}/report`;

  const fallbackName = `invoice-${orderId.slice(-8).toUpperCase()}.pdf`;

  try {
    const response = await api.get(url, { responseType: "blob" });

    if (response.data?.type === "application/json") {
      throw new Error(await parseBlobError(response.data));
    }

    const filename = filenameFromDisposition(
      response.headers["content-disposition"],
      fallbackName,
    );

    const blobUrl = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      throw new Error(await parseBlobError(error.response.data));
    }
    throw error;
  }
}
