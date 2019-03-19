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
	const defaultSrc = `https://res.cloudinary.com/demo/image/upload/w_${srcsetSizes[0]}/${id}`;
	const srcsetURLs = getMaxNumOfSizes(srcsetSizesWithRetina, 5)
		.map(size => `https://res.cloudinary.com/demo/image/upload/w_${size}/${id} ${size}w`);
	const sizesStr = getImgSizeStrings(imgSizes, mediaQueries).join(', ');

	return `<img src="${defaultSrc}" srcset="${srcsetURLs.join(', ')}" sizes="${sizesStr}" alt="${alt}" />`;
}

let exampleImage = generateImage('turtles.jpg', {s: '50vw', l: '25vw'});
```

### Output example
`exampleImage` will be a string with the following output

```js
<img src="https://res.cloudinary.com/demo/image/upload/w_480/turtles.jpg" srcset="https://res.cloudinary.com/demo/image/upload/w_480/turtles.jpg 480w, https://res.cloudinary.com/demo/image/upload/w_640/turtles.jpg 640w, https://res.cloudinary.com/demo/image/upload/w_1024/turtles.jpg 1024w, https://res.cloudinary.com/demo/image/upload/w_1440/turtles.jpg 1440w, https://res.cloudinary.com/demo/image/upload/w_1920/turtles.jpg 1920w" sizes="(min-width:1025px) 25vw, 50vw" alt="" />
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


#### What just happened?
`getSrcsetSizes` will 
* loop through each size provided (`50vw`, `25vw`),
* create a `50vw` and `25vw` for the relevant media query breakpoint (i.e. `50vw` of `640` is `320`),
* remove duplicates - `50vw` of `1280` and `25vw` of `2560` are both `640`,
* and sort them in ascending order.

This allows you to build your image URLs by convention like so

```js
const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
const srcsetURLs = srcsetSizes.map(size => `https://res.cloudinary.com/demo/image/upload/w_${size}/${id} ${size}w`).join(', ');
```


`srcsetURLs` will generate the following values

```js
https://res.cloudinary.com/demo/image/upload/w_320/turtles.jpg 320w,
https://res.cloudinary.com/demo/image/upload/w_512/turtles.jpg 512w,
https://res.cloudinary.com/demo/image/upload/w_480/turtles.jpg 480w,
https://res.cloudinary.com/demo/image/upload/w_640/turtles.jpg 640w
```

Using the code snippet above, you can then autogenerate your `src` and `srcsets` for your `<img />` tag
```js
<img src="https://res.cloudinary.com/demo/image/upload/w_320/turtles.jpg" srcset="https://res.cloudinary.com/demo/image/upload/w_320/turtles.jpg 320w, https://res.cloudinary.com/demo/image/upload/w_480/turtles.jpg 480w, https://res.cloudinary.com/demo/image/upload/w_512/turtles.jpg 512w, https://res.cloudinary.com/demo/image/upload/w_640/turtles.jpg 640w" alt="" />
```

Cool huh?

### Wait, what about Retina screens?
```js
const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
const srcsetSizesWithRetina = getRetinaSizes(srcsetSizes, 2, 3); // generate 2x and 3x
const srcsetURLs = srcsetSizesWithRetina.map(size => `https://res.cloudinary.com/demo/image/upload/w_${size}/${id} ${size}w`).join(', ');
```

Using the code snippet above, your `<img />` tag will like this
```js
<img src="https://res.cloudinary.com/demo/image/upload/w_320/turtles.jpg" srcset="https://res.cloudinary.com/demo/image/upload/w_320/turtles.jpg 320w, https://res.cloudinary.com/demo/image/upload/w_480/turtles.jpg 480w, https://res.cloudinary.com/demo/image/upload/w_512/turtles.jpg 512w, https://res.cloudinary.com/demo/image/upload/w_640/turtles.jpg 640w, https://res.cloudinary.com/demo/image/upload/w_960/turtles.jpg 960w, https://res.cloudinary.com/demo/image/upload/w_1024/turtles.jpg 1024w, https://res.cloudinary.com/demo/image/upload/w_1280/turtles.jpg 1280w, https://res.cloudinary.com/demo/image/upload/w_1440/turtles.jpg 1440w, https://res.cloudinary.com/demo/image/upload/w_1536/turtles.jpg 1536w, https://res.cloudinary.com/demo/image/upload/w_1920/turtles.jpg 1920w" alt="" />
```

### Is there a way to limit the results?

You can use *getMaxNumOfSizes* which will take N results from the set without the sizes being too close to each other
```js
const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
// generate 2x and 3x and limit results to 5
const srcsetSizesWithRetina = getMaxNumOfSizes(getRetinaSizes(srcsetSizes, 2, 3), 5);
const srcsetURLs = srcsetSizesWithRetina.map(size => `https://res.cloudinary.com/demo/image/upload/w_${size}/${id} ${size}w`).join(', ');
```

Using the code snippet above, your `<img />` tag will like this
```js
<img src="https://res.cloudinary.com/demo/image/upload/w_480/turtles.jpg" srcset="https://res.cloudinary.com/demo/image/upload/w_480/turtles.jpg 480w, https://res.cloudinary.com/demo/image/upload/w_640/turtles.jpg 640w, https://res.cloudinary.com/demo/image/upload/w_1024/turtles.jpg 1024w, https://res.cloudinary.com/demo/image/upload/w_1440/turtles.jpg 1440w, https://res.cloudinary.com/demo/image/upload/w_1920/turtles.jpg 1920w" alt="" />
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

`sizesStr` will produce a set that will look like this
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

`sizesStr` will produce a set that will look like this
```js
['(min-width:1025px) 25vw', '50vw']
```

For more technical documentation, please visit https://kbalagtey-tacit.github.io/responsive-image-utils/

