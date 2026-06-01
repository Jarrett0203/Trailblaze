export const truncate = (text?: string) => {
  return text ? text.slice(0, 200) + "..." : undefined;
}
