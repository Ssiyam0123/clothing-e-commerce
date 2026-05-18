export const isAdminRoute = (pathname) => {
  const path =
    pathname ??
    (typeof window !== "undefined" ? window.location.pathname : "");
  return path.startsWith("/admin");
};
