/**
 * Use this to generate retina sizes for your sizes
 *
 * @param sizesArr - array of numbers [320, 640, 1024, 2048]
 * @param [multiplier] - number to multiply the images by, you can provide multiples getRetinaSizes(array, 2, 3, 4)
 * @returns Number array of generated image sizes
 *
 */
export default function getRetinaSizes(sizesArr: number[], ...multiplier: number[]): number[] {
  const newSizes = multiplier
    .map(n => sizesArr.slice(0).map(size => size * n))
    .reduce((prev, curr) => [...prev, ...curr], sizesArr)

  return Array.from(new Set(newSizes))
}
