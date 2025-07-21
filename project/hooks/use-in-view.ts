"use client";

import { RefObject } from "react";

interface UseInViewOptions {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

// Revisi: selalu return true untuk matikan semua animasi berbasis in-view
export function useInView(
  ref: RefObject<Element>,
  options: UseInViewOptions = {}
): boolean {
  return true;
}
