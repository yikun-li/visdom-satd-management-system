import {useEventListener} from "./useEventListener";

export function useOutsideClick(container: HTMLElement | null, callback: () => void): void {
  const doc = process.browser ? document : ({} as Document);

  const handlePress = (event: Event) => {
    if (container && !container.contains(event.target as HTMLElement)) {
      callback();
    }
  };

  const handleKeyUp = (event: Event) => {
    if ((event as KeyboardEvent).key === "Escape") {
      callback();
    }
  };

  useEventListener(doc, "mousedown", handlePress);
  useEventListener(doc, "touchend", handlePress);
  useEventListener(doc, "keyup", handleKeyUp);
}
