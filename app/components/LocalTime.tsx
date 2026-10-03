"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function LocalTime({
  value,
  fallback = "—",
}: {
  value: Date | string | null | undefined;
  fallback?: string;
}) {

  const isClient = useSyncExternalStore(subscribe, () => true, () => false);

  if (!value) return <span>{fallback}</span>;
  if (!isClient) return <span>{fallback}</span>;
  return <span>{new Date(value).toLocaleString()}</span>;
}
