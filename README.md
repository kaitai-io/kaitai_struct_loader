# Kaitai-Struct loader for webpack
This loader adds support for [kaitai-struct](https://kaitai.io) .ksy definitions

## Installation

```sh
yarn add --dev kaitai-struct-loader
```

## Usage

file.js

```js
import KaitaiStream form 'kaitai-struct/KaitaiStream';
import DoomWAD from './game/doom_wad.ksy';

const stream = new KaitaiStream(arrayBuffer);
const data = new DoomWAD(stream);
```
*A specification of the Doom wad format can be found at the [format gallery](http://formats.kaitai.io/doom_wad/index.html).*

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
|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`debug`**|`{Boolean}`|`false`|Switch loader to debug mode|
