export function copy(text: string) {
  if (text.trim().length == 0) return;

  navigator.clipboard.writeText(text).then(() => {
    console.log("copied", text, "to clipboard");
  });
}
