# Kaitai-Struct loader for webpack
This loader adds support for kaitai-struct .ksy definitions

## Installation

```sh
yarn add --dev kaitai-struct-loader
```

## Usage

file.js

```js
import KaitaiStream form 'kaitai-struct/KaitaiStream';
import DoomData from './game/doom_wad.ksy';

const data = new DoomData(new KaitaiStream(arrayBuffer, 0));
```

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
