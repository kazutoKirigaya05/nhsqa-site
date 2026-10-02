"use client";
import { useSyncExternalStore } from "react";
const noop = () => () => {};
/** False on the server and during hydration, true afterwards. */
export function useHydrated() { return useSyncExternalStore(noop, () => true, () => false); }
