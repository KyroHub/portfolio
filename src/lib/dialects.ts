const DIALECT_LABEL_KEYS: Record<string, string> = {
  ALL: "dialect.ALL",
  A: "dialect.A",
  B: "dialect.B",
  F: "dialect.F",
  Fb: "dialect.Fb",
  L: "dialect.L",
  La: "dialect.La",
  O: "dialect.O",
  S: "dialect.S",
  Sa: "dialect.Sa",
  Sf: "dialect.Sf",
};

export function normalizeDialectKey(dialectKey: string): string {
  const trimmedKey = dialectKey.trim();

  if (trimmedKey === "sA") {
    return "L";
  }

  if (trimmedKey === "NH") {
    return "La";
  }

  if (trimmedKey === "Fb" || trimmedKey === "La" || trimmedKey === "Sa" || trimmedKey === "Sf") {
    return trimmedKey;
  }

  return trimmedKey.toUpperCase();
}

export function getDialectLabelKey(siglum: string) {
  return DIALECT_LABEL_KEYS[siglum];
}
