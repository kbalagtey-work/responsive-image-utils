### Usage example

```js
import {
	getSrcsetSizes,
	getRetinaSizes,
	getMaxNumOfSizes,
	getImgSizeStrings,
	getSizesWithInterval,
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
	const srcsetURLs = getMaxNumOfSizes(getSizesWithInterval(srcsetSizesWithRetina, 150), 7)
		.map(size => `https://res.cloudinary.com/demo/image/upload/w_${size}/${id} ${size}w`);
	const sizesStr = getImgSizeStrings(imgSizes, mediaQueries).join(', ');

	return `<img src="${defaultSrc}" srcset="${srcsetURLs.join(', ')}" sizes="${sizesStr}" alt="${alt}" />`;
}

let exampleImage = generateImage('turtles.jpg', {s: '50vw', l: '25vw'});
```

### Output example
`exampleImage` will be a string with the following output

```js
<img src="https://res.cloudinary.com/demo/image/upload/w_256/turtles.jpg" srcset="https://res.cloudinary.com/demo/image/upload/w_256/turtles.jpg 256w, https://res.cloudinary.com/demo/image/upload/w_512/turtles.jpg 512w, https://res.cloudinary.com/demo/image/upload/w_768/turtles.jpg 768w, https://res.cloudinary.com/demo/image/upload/w_1024/turtles.jpg 1024w, https://res.cloudinary.com/demo/image/upload/w_1280/turtles.jpg 1280w, https://res.cloudinary.com/demo/image/upload/w_1536/turtles.jpg 1536w, https://res.cloudinary.com/demo/image/upload/w_3072/turtles.jpg 3072w" sizes="(min-width:1025px) 20vw, 100vw" alt="">
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
<img src="https://res.cloudinary.com/demo/image/upload/w_320/turtles.jpg" srcset="https://res.cloudinary.com/demo/image/upload/w_320/turtles.jpg 320w, https://res.cloudinary.com/demo/image/upload/w_480/turtles.jpg 480w, https://res.cloudinary.com/demo/image/upload/w_512/turtles.jpg 512w, https://res.cloudinary.com/demo/image/upload/w_640/turtles.jpg 640w, https://res.cloudinary.com/demo/image/upload/w_960/turtles.jpg 960w, https://res.cloudinary.com/demo/image/upload/w_1024/turtles.jpg 1024w, https://res.cloudinary.com/demo/image/upload/w_1280/turtles.jpg 1280w, https://res.cloudinary.com/demo/image/upload/w_1440/turtles.jpg 1440w, https://res.cloudinary.com/demo/image/upload/w_1536/turtles.jpg 1536w, https://res.cloudinary.com/demo/image/upload/w_1920/turtles.jpg 1920w" />
```

### Is there a way to limit the results?

You can use *getSizesWithInterval* which will take N results from the set without the sizes being too close to each other. For example, if you have the following sizes `[300, 320, 460, 480, 1024]`, you might want to remove `300` & `460` since the 20px difference with the next size up has a bigger performance cost with page weight over the cost of serving a bigger image size. In this case you can do the following

```js
const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
// generate 2x and 3x and limit results to 5
const srcsetSizesWithRetina = getSizesWithInterval(getRetinaSizes(srcsetSizes, 2, 3), 20);
const srcsetURLs = srcsetSizesWithRetina.map(size => `https://res.cloudinary.com/demo/image/upload/w_${size}/${id} ${size}w`).join(', ');
```

You can also use *getMaxNumOfSizes* which will take N results from the set if you want to limit the number of sizes. The logic will start from the largest size, taking every *N* size according to the number of sizes available and the number of sizes wanted. For example, a set of `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]` where you only want `5` sizes will return the following set [2, 4, 6, 8, 10]. If there is no equal distribution (say you want 7 of 10) then it will prefer the smaller sizes and return the following set `[1, 2, 3, 4, 6, 8, 10]`. Why? because there are more variation in mobile sizes where a more accurate sizing is more beneficial.

```js
const srcsetSizes = getSrcsetSizes(mySizes, mediaQueries);
// generate 2x and 3x and limit results to 5
const srcsetSizesWithRetina = getMaxNumOfSizes(getSizesWithInterval(getRetinaSizes(srcsetSizes, 2, 3), 20), 7);
const srcsetURLs = srcsetSizesWithRetina.map(size => `https://res.cloudinary.com/demo/image/upload/w_${size}/${id} ${size}w`).join(', ');
```

Using the code snippet above, your `<img />` tag will like this
```js
<img src="https://res.cloudinary.com/demo/image/upload/w_256/turtles.jpg" srcset="https://res.cloudinary.com/demo/image/upload/w_256/turtles.jpg 256w, https://res.cloudinary.com/demo/image/upload/w_512/turtles.jpg 512w, https://res.cloudinary.com/demo/image/upload/w_768/turtles.jpg 768w, https://res.cloudinary.com/demo/image/upload/w_1024/turtles.jpg 1024w, https://res.cloudinary.com/demo/image/upload/w_1280/turtles.jpg 1280w, https://res.cloudinary.com/demo/image/upload/w_1536/turtles.jpg 1536w, https://res.cloudinary.com/demo/image/upload/w_3072/turtles.jpg 3072w">
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

