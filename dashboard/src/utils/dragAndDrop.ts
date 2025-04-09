interface DragAndDropOptions {
  onDragStart?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  dragImage?: string;
  dragImageOffset?: { x: number; y: number };
}

export class DragAndDropManager {
  private static instance: DragAndDropManager;
  private options: Map<string, DragAndDropOptions> = new Map();
  private draggedElement: HTMLElement | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): DragAndDropManager {
    if (!DragAndDropManager.instance) {
      DragAndDropManager.instance = new DragAndDropManager();
    }
    return DragAndDropManager.instance;
  }

  private initialize(): void {
    document.addEventListener('dragstart', this.handleDragStart.bind(this));
    document.addEventListener('dragover', this.handleDragOver.bind(this));
    document.addEventListener('dragend', this.handleDragEnd.bind(this));
    document.addEventListener('drop', this.handleDrop.bind(this));
  }

  public register(element: HTMLElement, options: DragAndDropOptions): void {
    element.setAttribute('draggable', 'true');
    this.options.set(element.id, options);
  }

  public unregister(element: HTMLElement): void {
    element.removeAttribute('draggable');
    this.options.delete(element.id);
  }

  private handleDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement;
    if (!target || !target.id) return;

    const options = this.options.get(target.id);
    if (!options) return;

    this.draggedElement = target;

    if (options.dragImage) {
      const img = new Image();
      img.src = options.dragImage;
      event.dataTransfer?.setDragImage(
        img,
        options.dragImageOffset?.x || 0,
        options.dragImageOffset?.y || 0
      );
    }

    if (options.onDragStart) {
      options.onDragStart(event);
    }
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.draggedElement) return;

    const target = event.target as HTMLElement;
    if (!target || !target.id) return;

    const options = this.options.get(target.id);
    if (options?.onDragOver) {
      options.onDragOver(event);
    }
  }

  private handleDragEnd(event: DragEvent): void {
    if (!this.draggedElement) return;

    const options = this.options.get(this.draggedElement.id);
    if (options?.onDragEnd) {
      options.onDragEnd(event);
    }

    this.draggedElement = null;
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    if (!this.draggedElement) return;

    const target = event.target as HTMLElement;
    if (!target || !target.id) return;

    const options = this.options.get(target.id);
    if (options?.onDrop) {
      options.onDrop(event);
    }

    this.draggedElement = null;
  }
}

export const dragAndDropManager = DragAndDropManager.getInstance(); 