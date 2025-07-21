"use client";

import { RefObject } from "react";

interface UseInViewOptions {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

// Hook dummy: selalu mengembalikan true, tidak ada animasi atau observer sama sekali
export function useInView(
  ref: RefObject<Element>,
  options: UseInViewOptions = {}
): boolean {
  return true;
}
