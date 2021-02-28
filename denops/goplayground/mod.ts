import { start } from "../../vendor/https/deno.land/x/denops_std/mod.ts";
import { run, fmt, share } from "./gp.ts";

function mustBeString(value: unknown): value is string {
  if (typeof value !== "string") {
    throw new Error("attribute must be string");
  }
  return true
}

start(async (denops) => {
  denops.register({
    async goPlayRun(text: unknown): Promise<void> {
      if (mustBeString(text)) {
        await run(text);
      }
    },
    async goPlayFmt(text: unknown): Promise<unknown> {
      if (mustBeString(text)) {
        return fmt(text);
      }
      return "";
    },
    async goPlayShare(text: unknown): Promise<unknown> {
      if (mustBeString(text)) {
        return share(text);
      }
      return "";
    },
  });

  await denops.execute(`
    command! -nargs=1 GoPlayRun echomsg denops#request('${denops.name}', 'goPlayRun', [<q-args>])
    command! -nargs=1 GoPlayFmt echomsg denops#request('${denops.name}', 'goPlayFmt', [<q-args>])
    command! -nargs=1 GoPlayShare echomsg denops#request('${denops.name}', 'goPlayShare', [<q-args>])
  `);
});
