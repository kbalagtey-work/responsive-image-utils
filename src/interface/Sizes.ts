/**
 * This should match your media query naming convention
 * The values can use VW or PX
 *
 * ```ts
 * {
 *   xs: '100vw',
 *   sm: '75vw',
 *   md: '50vw',
 *   lg: '40vw',
 * }
 * ```
 * 
 * OR
 * 
 * ```ts
 * {
 *   s: '100vw',
 *   m: '75vw',
 *   l: '50vw',
 *   xl: '40vw',
 *   xxl: '2560px',
 * }
 * ```
 */
export default interface Sizes {
  [key:string]: string;
}