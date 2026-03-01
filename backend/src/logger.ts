// src/logger.ts
export const log = (...args: any[]) => {
  process.stdout.write(args.join(" ") + "\n");
};
