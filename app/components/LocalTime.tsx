"use client";

export default function LocalTime({
  value,
  fallback = "—",
}: {
  value: Date | string | null | undefined;
  fallback?: string;
}) {
  if (!value) return <span>{fallback}</span>;
  return <span>{new Date(value).toLocaleString()}</span>;
}