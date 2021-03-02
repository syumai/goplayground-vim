import { start } from "./vendor/https/deno.land/x/denops_std/mod.ts";
import { run, fmt, share, get } from "./gp.ts";

start(async (vim) => {
  const getLines = async (): Promise<string> => {
    const lines = await vim.call("getline", 0, "$") as string[];
    return lines.join("\n");
  }

  const replaceBuffer = async (text: string): Promise<void> => {
    await vim.call("execute", "%d");
    const lines = text.split("\n");
    await vim.call("setline", "1", lines);
  }

  const createBuffer = async (text: string): Promise<void> => {
    await vim.call("execute", "new");
    const lines = text.split("\n");
    await vim.call("setline", "1", lines);
  }

  vim.register({
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

  await vim.execute(`
    function! s:goplayground_show_all_lines(text) " {{{
      let lines = split(a:text, '\\n')
      for line in lines
        echomsg line
      endfor
    endfunction

    command! GoPlayRun call s:goplayground_show_all_lines(denops#request('${vim.name}', 'goPlayRun', []))
    command! GoPlayFmt call denops#request('${vim.name}', 'goPlayFmt', [])
    command! GoPlayShare echomsg denops#request('${vim.name}', 'goPlayShare', [])
    command! -nargs=1 GoPlayGet call denops#request('${vim.name}', 'goPlayGet', [<q-args>])
  `);
});
