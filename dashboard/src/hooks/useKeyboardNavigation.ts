import { useState, useEffect } from 'react';

interface UseKeyboardNavigationProps<T> {
  items: T[];
  onSelect?: (index: number) => void;
  onExpand?: (index: number) => void;
}

export function useKeyboardNavigation<T>({
  items,
  onSelect,
  onExpand,
}: UseKeyboardNavigationProps<T>) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next >= items.length ? 0 : next;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? items.length - 1 : next;
          });
          break;

        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            onSelect?.(focusedIndex);
          }
          break;

        case 'Space':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            onExpand?.(focusedIndex);
          }
          break;

        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;

        case 'End':
          e.preventDefault();
          setFocusedIndex(items.length - 1);
          break;

        case 'Escape':
          e.preventDefault();
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items.length, focusedIndex, onSelect, onExpand]);

  return {
    focusedIndex,
    setFocusedIndex,
  };
} 