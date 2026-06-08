import pc from "picocolors";

export const ui = {
  title: (s: string) => console.log(pc.bold(pc.magenta(`\n  ${s}`))),
  section: (s: string) => console.log(pc.bold(`\n${s}`)),
  item: (s: string) => console.log(`  ${s}`),
  ok: (s: string) => console.log(`  ${pc.green("✓")} ${s}`),
  warn: (s: string) => console.log(`  ${pc.yellow("!")} ${s}`),
  fail: (s: string) => console.log(`  ${pc.red("✗")} ${s}`),
  dim: (s: string) => pc.dim(s),
  count: (n: number) => pc.cyan(String(n)),
};
