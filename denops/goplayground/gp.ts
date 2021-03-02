import { GoPlayground, defaultGoPlaygroundHostName } from "./vendor/https/deno.land/x/goplayground/index.ts";

const gpOriginal = new GoPlayground();
const gpGo2Go = new GoPlayground("https://go2goplay.golang.org");

type GPType = 'original' | 'go2go';

function gp(t: GPType): GoPlayground {
  switch(t) {
    case 'original':
      return gpOriginal;
    case 'go2go':
      return gpGo2Go;
  }
  return gpOriginal;
}


export async function run(t: GPType, src: string): Promise<string> {
  const result = await gp(t).compile(src);
  if (result.Errors !== "") {
    throw new Error(result.Errors)
  }
  return result.Events
    .map(({ Message }) => Message)
    .join("\n");
}

export async function fmt(t: GPType, src: string): Promise<string> {
  const result = await gp(t).format(src, false);
  if (result.Error !== "") {
    throw new Error(result.Error)
  }
  return result.Body;
}

export async function share(t: GPType, src: string): Promise<string> {
  const result = await gp(t).share(src);
  return `${defaultGoPlaygroundHostName}/p/${result}`;
}

export async function get(t: GPType, key: string): Promise<string> {
  return await gp(t).download(key);
}
