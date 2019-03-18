import MediaQueries, { MediaQueriesDefault } from './interface/MediaQueries';
import Sizes from './interface/Sizes';

/**
 * Use this to combine your media queries and sizes to generate a string to populate your image tag
 *
 * @param sizes - key/value pair of media query and image size {s: '50vw', l: '25vw', xl: '500px'}
 * @param mediaQueries - Optional. key/value pair of media query breakpoints. Defaults to MediaQueriesDefault
 * @returns String array of generated string sizes
 *
 */
export const getImgSizeStrings = (sizes: Sizes, mediaQueries: MediaQueries = MediaQueriesDefault) : string[] => {
  const mediaQueriesMinWidth = () => {
    let prevKey = '';
    return Object.keys(mediaQueries)
      .map(key => {
        const currentMinWidth = mediaQueries[prevKey]
          ? mediaQueries[prevKey] + 1
          : 0;
        prevKey = key;
        return {
          [key]: currentMinWidth,
        };
      })
      .reduce((prev, curr) => Object.assign(prev, curr), {});
  };

  return Object.keys(sizes)
    .map((sizeKey: string) : string => {
      if (mediaQueriesMinWidth()[sizeKey] === 0) {
        return sizes[sizeKey];
      }

      return `(min-width:${mediaQueriesMinWidth()[sizeKey]}px) ${sizes[sizeKey]}`;
    })
    .reverse();
};

/**
 * Use this to auto calculate various image sizes based on your media query breakpoints and fluid image sizes using VW
 *
 * @param sizes - key/value pair of media query and image size {s: '50vw', l: '25vw', xl: '500px'}
 * @param mediaQueries - Optional. key/value pair of media query breakpoints. Defaults to MediaQueriesDefault
 * @returns Number array of generated image sizes
 *
 */
export const getSrcsetSizes = function(sizes: Sizes, mediaQueries: MediaQueries = MediaQueriesDefault): number[] {
  let prevSize = '100vw';
  const getSizePerMediaQuery = Object.keys(mediaQueries).map((key: string) => {
    const currentSize = sizes[key] ? sizes[key] : prevSize;
    prevSize = currentSize;
    return {
      [key]: currentSize,
    };
  });

  const srcSets = getSizePerMediaQuery.map((sizeObj: { [key:string]: any }): number => {
    const key = Object.keys(sizeObj)[0];
    const sizeValue = sizeObj[key];
    const unit = sizeValue.slice(-2);
    const mediaQuery = parseInt(sizeValue.replace(unit, ''), 10);

    if (unit !== 'px' && unit !== 'vw') {
      throw new Error(`${unit} unit is not supported. Only supports px & vw`);
    }

    return unit === 'px'
      ? mediaQuery
      : Math.round((mediaQueries[key] * mediaQuery) / 100);
  });

  return Array.from(new Set(srcSets)).sort((a, b) => a - b);
};

/**
 * Use this to limit the number of image sizes provided to the browser.
 * This will automatically choose every Nth image to ensure image sizes are not so close to each other
 *
 * @param max - the maximum number of sizes
 * @param sizesArr - array of numbers [320, 640, 1024, 2048]
 * @returns Number array of generated image sizes
 *
 */
export const getMaxNumOfSizes = (sizesArr: number[], max: number) : number[] => {
  if (max > sizesArr.length) {
    throw new Error('Max is greater than sizes length!');
  }

  const ascSizes = sizesArr.sort((a, b) => a - b);

  return Array(max).fill(0).map((n, i) => {
    const index = ascSizes.length - (i * Math.ceil(ascSizes.length/max));
    if (index < 1) {
      return (i * Math.ceil(ascSizes.length/max)) - (ascSizes.length) + 1
    }

    return index;
  }).map(n => ascSizes[n-1]).sort((a, b) => a - b);
};

/**
 * Use this to generate retina sizes for your sizes
 *
 * @param sizesArr - array of numbers [320, 640, 1024, 2048]
 * @param [multiplier] - number to multiply the images by, you can provide multiples getRetinaSizes(array, 2, 3, 4)
 * @returns Number array of generated image sizes
 *
 */
export const getRetinaSizes = (sizesArr: number[], ...multiplier: number[]) : number[] => {
  const newSizes = multiplier.map(n =>
    sizesArr.slice(0).map((size) => size * n)
  ).reduce((prev, curr) => [...prev, ...curr], sizesArr);

  return Array.from(new Set(newSizes));
}
