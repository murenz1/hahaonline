interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

class KeyboardShortcuts {
  private static instance: KeyboardShortcuts;
  private shortcuts: Map<string, Shortcut> = new Map();
  private enabled: boolean = true;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): KeyboardShortcuts {
    if (!KeyboardShortcuts.instance) {
      KeyboardShortcuts.instance = new KeyboardShortcuts();
    }
    return KeyboardShortcuts.instance;
  }

  private initialize(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  public register(shortcut: Shortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  public unregister(key: string): void {
    this.shortcuts.delete(key);
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public getShortcuts(): Shortcut[] {
    return Array.from(this.shortcuts.values());
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    const key = this.getEventKey(event);
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  private getShortcutKey(shortcut: Shortcut): string {
    return [
      shortcut.ctrlKey ? 'Ctrl+' : '',
      shortcut.shiftKey ? 'Shift+' : '',
      shortcut.altKey ? 'Alt+' : '',
      shortcut.key,
    ].join('');
  }

  private getEventKey(event: KeyboardEvent): string {
    return [
      event.ctrlKey ? 'Ctrl+' : '',
      event.shiftKey ? 'Shift+' : '',
      event.altKey ? 'Alt+' : '',
      event.key,
    ].join('');
  }
}

export const keyboardShortcuts = KeyboardShortcuts.getInstance();

// Default shortcuts
keyboardShortcuts.register({
  key: 'r',
  ctrlKey: true,
  action: () => {
    // Refresh the current view
    window.location.reload();
  },
  description: 'Refresh the current view',
});

keyboardShortcuts.register({
  key: 's',
  ctrlKey: true,
  action: () => {
    // Save current state
    const event = new CustomEvent('saveState');
    window.dispatchEvent(event);
  },
  description: 'Save current state',
});

keyboardShortcuts.register({
  key: 'd',
  ctrlKey: true,
  action: () => {
    // Toggle dark mode
    const event = new CustomEvent('toggleDarkMode');
    window.dispatchEvent(event);
  },
  description: 'Toggle dark mode',
});

keyboardShortcuts.register({
  key: 'f',
  ctrlKey: true,
  action: () => {
    // Focus search input
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  },
  description: 'Focus search input',
});

keyboardShortcuts.register({
  key: 'h',
  ctrlKey: true,
  action: () => {
    // Toggle help panel
    const event = new CustomEvent('toggleHelp');
    window.dispatchEvent(event);
  },
  description: 'Toggle help panel',
}); 