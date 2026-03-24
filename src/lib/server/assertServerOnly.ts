export function assertServerOnly(moduleName: string) {
  if (typeof window !== "undefined") {
    throw new Error(
      `${moduleName} is server-only and depends on the Node.js runtime.`,
    );
  }
}
