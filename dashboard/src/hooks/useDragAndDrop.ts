import { useEffect, useRef } from 'react';
import { dragAndDropManager, DragAndDropOptions } from '../utils/dragAndDrop';

export const useDragAndDrop = (options: DragAndDropOptions) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Generate a unique ID if the element doesn't have one
    if (!element.id) {
      element.id = `drag-${Math.random().toString(36).substr(2, 9)}`;
    }

    dragAndDropManager.register(element, options);

    return () => {
      dragAndDropManager.unregister(element);
    };
  }, [options]);

  return elementRef;
}; 