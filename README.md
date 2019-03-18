# Responsive image utilities

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/kbalagtey-tacit/responsive-image-utils.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/kbalagtey-tacit/responsive-image-utils.svg)](https://travis-ci.org/kbalagtey-tacit/responsive-image-utils)
[![Coverage Status](https://coveralls.io/repos/github/kbalagtey-tacit/responsive-image-utils/badge.svg)](https://coveralls.io/github/kbalagtey-tacit/responsive-image-utils)
[![Dev Dependencies](https://david-dm.org/kbalagtey-tacit/responsive-image-utils/dev-status.svg)](https://david-dm.org/kbalagtey-tacit/responsive-image-utils?type=dev)

Utility functions to make it easier to work with auto generated responsive images for better performance optimised images.

### How it works?
Please spend some time to read the following links which I think explains the concept of responsive images pretty well.

* https://ericportis.com/posts/2014/srcset-sizes/#part-2
* https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images

### ES6 Usage
```js
npm install -D responsive-image-utils
```

ES6 Demo - https://codesandbox.io/s/1z15pnyk5j

### ES5 Usage
Add the following script tag to your project

```js
<script src="https://unpkg.com/responsive-image-utils/dist/responsive-image-utils.umd.js"></script>
```

ES5 Demo - https://jsfiddle.net/ikanedo/8h7nz15g/

### Usage example
```js
import {
	getSrcsetSizes,
	getRetinaSizes,
	getMaxNumOfSizes,
	getImgSizeStrings,
} from 'responsive-image-utils';

const generateImage = (id, imgSizes, alt = '') => {
	const mediaQueries = {
		s: 640,
		m: 1024,
		l: 1280,
		xl: 1920,
		xxl: 2560,
	};

	const srcsetSizes = getSrcsetSizes(imgSizes, mediaQueries);
	const srcsetSizesWithRetina = getRetinaSizes(srcsetSizes, 2, 3);
	const defaultSrc = `https://i1.adis.ws/i/playground/${id}?w=${srcsetSizes[0]}`;
	const srcsetURLs = getMaxNumOfSizes(srcsetSizesWithRetina, 5)
		.map(size => `https://images.site.com/${id}?width=${size} ${size}w`);
	const sizesStr = getImgSizeStrings(imgSizes, mediaQueries).join(', ');

	return `<img src="${defaultSrc}" srcset="${srcsetURLs.join(', ')}" sizes="${sizesStr}" alt="${alt}" />`;
}

let exampleImage = generateImage('image-name', {s: '50vw', l: '25vw'});
```

### Output example
`exampleImage` will be a string with the following output

```js
<img src="https://images.site.com/image-name?width=480" srcset="https://images.site.com/image-name?width=480, https://images.site.com/image-name?width=640, https://images.site.com/image-name?width=1024, https://images.site.com/image-name?width=1440, https://images.site.com/image-name?width=1920" sizes="(min-width:1025px) 25vw, 50vw" alt="" />
```

### Step by step example
```js
import { getSrcsetSizes } from 'responsive-image-utils';

const mySizes = {
	s: '50vw',
	l: '25vw'
};

const mediaQueries = {
	s: 640,
	m: 1024,
	l: 1280,
	xl: 1920,
	xxl: 2560,
};

const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
```


`srcsetSizes` will generate the following values
```js
[ 320, 480, 512, 640 ]
```

This allows you to build your image URLs by convention like so

```js
const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
const srcsetURLs = srcsetSizes.map(size => `https://images.site.com/image-name?width=${size}`).join(', ');
```


`srcsetURLs` will generate the following values

```js
https://images.site.com/image-name?width=320,
https://images.site.com/image-name?width=512,
https://images.site.com/image-name?width=480,
https://images.site.com/image-name?width=640
```

Using the code snippet above, you can then autogenerate your `src` and `srcsets` for your `<img />` tag
```js
<img src="https://images.site.com/image-name?width=320" srcset="https://images.site.com/image-name?width=320, https://images.site.com/image-name?width=480, https://images.site.com/image-name?width=512, https://images.site.com/image-name?width=640" alt="" />
```

Cool huh?

### Wait, what about Retina screens?
```js
const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
const srcsetSizesWithRetina = getRetinaSizes(srcsetSizes, 2, 3); // generate 2x and 3x
const srcsetURLs = srcsetSizesWithRetina.map(size => `https://images.site.com/image-name?width=${size}`).join(', ');
```

Using the code snippet above, your `<img />` tag will like this
```js
<img src="https://images.site.com/image-name?width=320" srcset="https://images.site.com/image-name?width=320, https://images.site.com/image-name?width=480, https://images.site.com/image-name?width=512, https://images.site.com/image-name?width=640, https://images.site.com/image-name?width=960, https://images.site.com/image-name?width=1024, https://images.site.com/image-name?width=1280, https://images.site.com/image-name?width=1440, https://images.site.com/image-name?width=1536, https://images.site.com/image-name?width=1920" alt="" />
```

### Is there a way to limit the results?

You can use *getMaxNumOfSizes* which will take N results from the set without the sizes being too close to each other
```js
const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
// generate 2x and 3x and limit results to 5
const srcsetSizesWithRetina = getMaxNumOfSizes(getRetinaSizes(srcsetSizes, 2, 3), 5);
const srcsetURLs = srcsetSizesWithRetina.map(size => `https://images.site.com/image-name?width=${size}`).join(', ');
```

Using the code snippet above, your `<img />` tag will like this
```js
<img src="https://images.site.com/image-name?width=480" srcset="https://images.site.com/image-name?width=480, https://images.site.com/image-name?width=640, https://images.site.com/image-name?width=1024, https://images.site.com/image-name?width=1440, https://images.site.com/image-name?width=1920" alt="" />
```

### Autogenerate the size attribute

The final step is to add the size attribute so that the browser will know which size it will load for a certain breakpoint

```js
const mediaQueries = {
	s: 640,
	m: 1024,
	l: 1280,
	xl: 1920,
	xxl: 2560,
};
const sizesStr = getImgSizeStrings({s: '50vw', m: '50vw', l: '25vw', xl: '25vw', xxl: '25vw'}, mediaQueries);
```

It will produce a set that will look like this
```js
['(min-width:1921px) 25vw', '(min-width:1281px) 25vw', '(min-width:1025px) 25vw', '(min-width:641px) 50vw', '50vw']
```

You can optimise your media queries if you only have two key breakpoints. You can refactor the code to be shorter like so
```js
const mediaQueries = {
	s: 640,
	m: 1024,
	l: 1280,
	xl: 1920,
	xxl: 2560,
};
const sizesStr = getImgSizeStrings({s: '50vw' l: '25vw'}, mediaQueries);
```

It will produce a set that will look like this
```js
['(min-width:1025px) 25vw', '50vw']
```

For more technical documentation, please visit https://kbalagtey-tacit.github.io/responsive-image-utils/


### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Run `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
