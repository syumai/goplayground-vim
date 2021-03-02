# goplayground-vim

* A Vim plugin to add commands to call [The Go Playground](https://play.golang.org/) from Vim.

## Installation

This plugin needs [denops.vim](https://github.com/vim-denops/denops.vim) and [Deno](https://deno.land).

### with vim-plug

```
Plug 'vim-denops/denops.vim'
Plug 'syumai/goplayground-vim'
```

## Usage

```
:GoPlayRun       " Run code in current buffer and show result.
:GoPlayFmt       " Format code in current buffer.
:GoPlayShare     " Share code in current buffer and show shared URL.
:GoPlayGet <key> " Get code by given The Go Playground's key and open in new buffer.
                 " Example: GoPlayGet lVnPEvROxzH
```

## Development

* This plugin is using [dem](https://github.com/syumai/dem) for module version management.

```
cd denops/goplayground
dem update https://...@x.x.x # update module
```

## Author

syumai
 
## LICENSE

MIT

