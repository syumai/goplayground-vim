import { start } from "../../vendor/https/deno.land/x/denops_std/mod.ts";
import { run, fmt, share, get } from "./gp.ts";

start(async (denops) => {
  const getLines = async (): Promise<string> => {
    const lines = await denops.call("getline", 0, "$") as string[];
    return lines.join("\n");
  }

  const replaceBuffer = async (text: string): Promise<void> => {
    await denops.call("execute", "%d");
    const lines = text.split("\n");
    await denops.call("setline", "1", lines);
  }

  const createBuffer = async (text: string): Promise<void> => {
    await denops.call("execute", "new");
    const lines = text.split("\n");
    await denops.call("setline", "1", lines);
  }

  denops.register({
    async goPlayRun(_: unknown): Promise<unknown> {
      const src = await getLines();
      return run(src);
    },
    async goPlayFmt(_: unknown): Promise<void> {
      const src = await getLines();
      const result = await fmt(src);
      await replaceBuffer(result);
    },
    async goPlayShare(_: unknown): Promise<unknown> {
      const src = await getLines();
      return share(src);
    },
    async goPlayGet(key: unknown): Promise<void> {
      if (typeof key !== "string") {
        throw new Error("attribute must be string");
      }
      const result = await get(key);
      await createBuffer(result);
    },
  });

  await denops.execute(`
    function! s:ShowAllLines(text) " {{{
      let lines = split(a:text, '\\n')
      for line in lines
        echomsg line
      endfor
    endfunction

    command! GoPlayRun call s:ShowAllLines(denops#request('${denops.name}', 'goPlayRun', []))
    command! GoPlayFmt call denops#request('${denops.name}', 'goPlayFmt', [])
    command! GoPlayShare echomsg denops#request('${denops.name}', 'goPlayShare', [])
    command! -nargs=1 GoPlayGet call denops#request('${denops.name}', 'goPlayGet', [<q-args>])
  `);
});
