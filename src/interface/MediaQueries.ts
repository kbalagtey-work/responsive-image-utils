/**
 * You can pass a boostrap like configuration
 * ```ts
 * {
 *   xs: 320,
 *   sm: 768,
 *   md: 992,
 *   lg: 1200,
 * }
 * ```
 *
 * Or a shorter version
 * ```ts
 * {
 *   s: 640,
 *   m: 1024,
 *   l: 1280,
 *   xl: 1920,
 *   xxl: 2560,
 * }
 * ```
 */
export default interface MediaQueries {
  [key:string]: number;
  [key:number]: number;
};

/** Default media query values */
export const MediaQueriesDefault = {
  s: 640,
  m: 1024,
  l: 1280,
  xl: 1920,
  xxl: 2560,
};
