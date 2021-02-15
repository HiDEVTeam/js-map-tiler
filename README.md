# JAVASCRIPT MAP TILER

This node module cuts an image into tiles, creating zones and zoom levels for [Google Map API](https://developers.google.com/maps/documentation) or [Leaflet API](https://leafletjs.com).



## What is Map Tiling?

From [Wikipedia](https://en.wikipedia.org/wiki/Tiled_web_map):

*« A tile map is a map displayed in a browser by seamlessly joining dozens of individually requested image or vector data files over the Internet. »*

This method allows to quickly display a map by loading it tile by tile (each tiles having the same size), rather than loading a single big image.



## How does it work?



![full demonstration of map tiling](https://i.imgur.com/GxtyDUb.png)



## Import module

```js
const tileImage = require('js_map_tiler');
```



## Structure

* src: Source code



## How to use

### Full example

```js
const tileImage = require('js_map_tiler');

tileImage('map.png', '{{z}}/{{x}}_{{y}}.png', 3, 512).then(() => {
    console.log("Successfully exported!");
}).catch(err => {
    console.log("Error", err);
});
```



### Arguments

```js
tileImage(sourcePath : String, destinationPath : String, maxZoomIndex : Number, tileSize : Number) : Promise
```



| Argument        | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| sourcePath      | Path of the source map                                       |
| destinationPath | Path of generated tiles (default `./out/{{z}}/{{x}}_{{y}}.png`)<br />  {{x}}, {{y}}: Coordinates of the tile<br />  {{z}}: Zoom level |
| maxZoomIndex    | Max level of zoom (default `3`)                              |
| tileSize        | Size of generated tiles in px (default `512`)                |



### Tile a simple image

Create tiles of an image called "map.jpg". Tiles will be created in "./out" folder:

```js
const tileImage = require('js_map_tiler');
tileImage('map.jpg');
```



### Custom outputs

You can define custom output as second argument:

```js
tileImage('map.jpg', '{{z}}/{{x}}_{{y}}.png');
```

This will create:

![custom output z/x_y](https://i.imgur.com/oFwTzuU.png)


However, this:

```js
tileImage('map.jpg', '{{z}}-{{x}}_{{y}}.png');
```

Will create:

![custom output z-x_y](https://i.imgur.com/waCHLtH.png)



### Callbacks

The `tileImage` function runs asynchronously with promises, you can access its callbacks with `then` and `catch`:

```js
tileImage('map.jpg', '{{z}}-{{x}}_{{y}}.png').then((files) => {
    console.log(`Successfully exported ${files.length} files!`);
}).catch(err => {
    console.log("Error", err);
});
```



## Author & License

Made by Baptiste Miquel for HiDEV under the MIT license.