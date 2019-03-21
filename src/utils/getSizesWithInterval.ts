/**
 * You can use *getSizesWithInterval* which will take N results from the set
 * without the sizes being too close to each other.
 * For example, if you have the following sizes `[300, 320, 460, 480, 1024]`,
 * you might want to remove `300` & `460` since the 20px difference with the
 * next size up has marginal benefit over page weight
 *
 * @param sizesArr - array of numbers [320, 640, 1024, 2048]
 * @param interval - how much interval should each size have from each other
 * @returns Number array of generated image sizes
 *
 */
export default function getSizesWithInterval(sizesArr: number[], interval: number): number[] {
  return sizesArr
    .sort((a, b) => b - a)
    .reduce((accumulator: number[], current: number): number[] => {
      if (accumulator[accumulator.length - 1] - current < interval) {
        return accumulator
      }

      return [...accumulator, current]
    }, [])
    .sort((a, b) => a - b)
}
