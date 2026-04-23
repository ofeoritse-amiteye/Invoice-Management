export function generateInvoiceId(existing: string[]): string {
  const letter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const id = `${letter()}${letter()}${1000 + Math.floor(Math.random() * 9000)}`;
    if (!existing.includes(id)) return id;
  }
  return `INV${Date.now()}`;
}

export function newItemId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
