import MediaQueries, { MediaQueriesDefault } from '../interface/MediaQueries'
import Sizes from '../interface/Sizes'

/**
 * Use this to combine your media queries and sizes to generate a string to populate your image tag
 *
 * @param sizes - key/value pair of media query and image size {s: '50vw', l: '25vw', xl: '500px'}
 * @param mediaQueries - Optional. key/value pair of media query breakpoints. Defaults to MediaQueriesDefault
 * @returns String array of generated string sizes
 *
 */
export default function getImgSizeStrings(
  sizes: Sizes,
  mediaQueries: MediaQueries = MediaQueriesDefault
): string[] {
  const mediaQueriesMinWidth = () => {
    let prevKey = ''
    return Object.keys(mediaQueries)
      .map(key => {
        const currentMinWidth = mediaQueries[prevKey] ? mediaQueries[prevKey] + 1 : 0
        prevKey = key
        return {
          [key]: currentMinWidth
        }
      })
      .reduce((prev, curr) => Object.assign(prev, curr), {})
  }

  return Object.keys(sizes)
    .map(
      (sizeKey: string): string => {
        if (mediaQueriesMinWidth()[sizeKey] === 0) {
          return sizes[sizeKey]
        }

        return `(min-width:${mediaQueriesMinWidth()[sizeKey]}px) ${sizes[sizeKey]}`
      }
    )
    .reverse()
}
