import MediaQueries, { MediaQueriesDefault } from '../interface/MediaQueries'
import Sizes from '../interface/Sizes'

/**
 * Use this to auto calculate various image sizes based on your media query breakpoints and fluid image sizes using VW
 *
 * @param sizes - key/value pair of media query and image size {s: '50vw', l: '25vw', xl: '500px'}
 * @param mediaQueries - Optional. key/value pair of media query breakpoints. Defaults to MediaQueriesDefault
 * @returns Number array of generated image sizes
 *
 */
export default function(sizes: Sizes, mediaQueries: MediaQueries = MediaQueriesDefault): number[] {
  let prevSize = '100vw'
  const getSizePerMediaQuery = Object.keys(mediaQueries).map((key: string) => {
    const currentSize = sizes[key] ? sizes[key] : prevSize
    prevSize = currentSize
    return {
      [key]: currentSize
    }
  })

  const srcSets = getSizePerMediaQuery.map(
    (sizeObj: { [key: string]: any }): number => {
      const key = Object.keys(sizeObj)[0]
      const sizeValue = sizeObj[key]
      const unit = sizeValue.slice(-2)
      const mediaQuery = parseInt(sizeValue.replace(unit, ''), 10)

      if (unit !== 'px' && unit !== 'vw') {
        throw new Error(`${unit} unit is not supported. Only supports px & vw`)
      }

      return unit === 'px' ? mediaQuery : Math.round((mediaQueries[key] * mediaQuery) / 100)
    }
  )

  return Array.from(new Set(srcSets)).sort((a, b) => a - b)
}
