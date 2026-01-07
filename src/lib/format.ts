import { Item } from "@/types";

export function formatForWhatsApp(items: Item[]): string {
  const ready = items.filter((item) => !item.needsReview);
  const needsReview = items.filter((item) => item.needsReview);

  let output = "🛒 Lista del mercado\n\n";

  if (ready.length > 0) {
    for (const item of ready) {
      output += formatItem(item, "✅") + "\n";
    }
  }

  if (needsReview.length > 0) {
    output += "\n⚠️ Revisar:\n";
    for (const item of needsReview) {
      output += formatItem(item, "•") + "\n";
    }
  }

  return output.trim();
}

function formatItem(item: Item, prefix: string): string {
  const qty = item.quantity !== null ? item.quantity : "?";
  const unit = item.unit || "unid";
  const notes = item.notes ? ` (${item.notes})` : "";

  if (item.quantity === null && item.unit === null) {
    return `${prefix} ${item.name} (sin cantidad)${notes}`;
  }

  return `${prefix} ${qty} ${unit} - ${item.name}${notes}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}

export async function shareViaWebShare(text: string): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title: "Lista del mercado",
      text,
    });
    return true;
  } catch {
    return false;
  }
}

export function canShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}
