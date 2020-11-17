# Kaitai Struct loader for webpack
This [webpack loader](https://webpack.js.org/concepts/loaders/) adds support for [Kaitai Struct](https://kaitai.io) .ksy definitions.

## Installation

```sh
yarn add --dev kaitai-struct-loader
```

## Usage

file.js

```js
import KaitaiStream from 'kaitai-struct/KaitaiStream';
import DoomWAD from './game/doom_wad.ksy';

const stream = new KaitaiStream(arrayBuffer);
const data = new DoomWAD(stream);
```
*The specification of the Doom .wad format can be found in the [format gallery](https://formats.kaitai.io/doom_wad/).*

webpack.config.js

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ksy$/,
        loader: 'kaitai-struct-loader'
      }
    ]
  }
}
```

## Options
| Name | Type | Default | Description |
| - | - | - | - |
| **`debug`** | `{boolean}` | `false` | Compile .ksy files in `--debug` mode<br> (see [#332](https://github.com/kaitai-io/kaitai_struct/issues/332) for more info) |
