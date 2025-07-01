/**
 * Dark mode management utility
 */
export class DarkModeManager {
  private static readonly STORAGE_KEY = 'darkMode';

  static getInitialMode(): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  }

  static toggleMode(currentMode: boolean): boolean {
    const newMode = !currentMode;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
    return newMode;
  }

  static applyMode(isDark: boolean): void {
    document.documentElement.classList.toggle('dark', isDark);
  }
}
