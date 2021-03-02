import { GoPlayground, defaultGoPlaygroundHostName } from "./vendor/https/deno.land/x/goplayground/index.ts";

const gp = new GoPlayground();

export async function run(src: string): Promise<string> {
  const result = await gp.compile(src);
  if (result.Errors !== "") {
    throw new Error(result.Errors)
  }
  return result.Events
    .map(({ Message }) => Message)
    .join("\n");
}

export async function fmt(src: string): Promise<string> {
  const result = await gp.format(src, false);
  if (result.Error !== "") {
    throw new Error(result.Error)
  }
  return result.Body;
}

export async function share(src: string): Promise<string> {
  const result = await gp.share(src);
  return `${defaultGoPlaygroundHostName}/p/${result}`;
}

export async function get(key: string): Promise<string> {
  return await gp.download(key);
}
