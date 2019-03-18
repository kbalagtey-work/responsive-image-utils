/**
 * Use this to limit the number of image sizes provided to the browser.
 * This will automatically choose every Nth image to ensure image sizes are not so close to each other
 *
 * @param max - the maximum number of sizes
 * @param sizesArr - array of numbers [320, 640, 1024, 2048]
 * @returns Number array of generated image sizes
 *
 */
export default function(sizesArr: number[], max: number): number[] {
  if (max > sizesArr.length) {
    throw new Error('Max is greater than sizes length!')
  }

  const ascSizes = sizesArr.sort((a, b) => a - b)

  return Array(max)
    .fill(0)
    .map((n, i) => {
      const index = ascSizes.length - i * Math.ceil(ascSizes.length / max)
      if (index < 1) {
        return i * Math.ceil(ascSizes.length / max) - ascSizes.length + 1
      }

      return index
    })
    .map(n => ascSizes[n - 1])
    .sort((a, b) => a - b)
}
