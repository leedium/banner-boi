#banner-boi   :)

##Version 1.0.0

EASY TO USE Automated HTML5 Standard Banner Creation Tool to save you crazy amounts of time.

![alt text](https://github.com/leedium/banner-boi/blob/master/files.png "Files")

##[Example](http://banner-boi.leedium.com)

##Includes

Multi Provider support for DoubleClick, Sizmek, ... more to come!

Customizable to add more providers.

8 of the most popular sizes.

[300x250, 336x280, 250x250, 120x600, 160x600, 300x600, 120x240, 728x90]

PNG image optimization

spritesheet generation for non responsive images

GSAP - Greensock Timeline / TweenLite CDN for animations.

SASS, css-pleeease, pre post css compiler.

ZIP Compresson on provider packages

Full Support for IE9 and above.

Handlebars for templating.

html minification

ability to override master version.

browser-sync

Coming SOON! - Apple iAd support


## Getting Started
This plugin requires Grunt

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may run the application with this command:

## Installation of packages

```js
  $ npm install
  OR
  $ sudo npm install //if you get permission errors
```

## Configure bannerConfig.js
```js
  /bannerConfig.js
```

## Modify the various html templates(.hbs) styles(.scss), .js
```js
  -/src/  //put non sprite images(<img>) here
    --images/sprites/  //where post polite load images go, generated:  spritesheet.png
    --images/sprites-polite/  //where pre polite load images go, generated spritesheet-polite.png
    --/scss/  //SASS styles, css overrides for banner sizes
    --/templates/
      --/partials   //overrides for js, and markup if need be
      --/includes   //provider specific api
      --/provider-template  // Shouldn't have to change these! Only add new ones as required
```


## Start Application
```js
  $ grunt
```

## View App (provider doubleclick)
```js
http://localhost:[port]/dck/index.html
```
