import {
  getSrcsetSizes,
  getMaxNumOfSizes,
  getImgSizeStrings,
  getRetinaSizes,
  getSizesWithInterval
} from '../src/responsive-image-utils'
import { MediaQueriesDefault } from '../src/interface/MediaQueries'

describe('getSrcsetSizes', () => {
  it('SHOULD return a PX equivalent for every PX size', () => {
    expect(getSrcsetSizes({ s: '30px' }, MediaQueriesDefault)).toEqual(expect.arrayContaining([30]))
  })

  it('SHOULD return a PX equivalent for every VW size according to the MQ', () => {
    expect(getSrcsetSizes({ s: '100vw' })).toEqual(
      expect.arrayContaining(Object.values(MediaQueriesDefault))
    )
  })

  it('SHOULD return an array containing various sizes of VW', () => {
    expect(getSrcsetSizes({ s: '95vw', l: '45vw' })).toEqual(
      expect.arrayContaining([576, 608, 864, 973, 1152])
    )
  })

  it('SHOULD throw an error if provided size is not PX or VW', () => {
    expect(() => getSrcsetSizes({ s: '30' })).toThrow()
    expect(() => getSrcsetSizes({ s: '30vh' })).toThrow()
    expect(() => getSrcsetSizes({ s: '30vw' })).not.toThrow()
    expect(() => getSrcsetSizes({ s: '30px' })).not.toThrow()
  })

  describe('WHEN size is not provided', () => {
    it('SHOULD return an array containing the pixel equivalent of 50VW small and 25vw for medium', () => {
      let values = Object.values(MediaQueriesDefault)
      let mqSmall = values.slice(0).map((n: number): number => n / 2)
      let mqMediumUp = values.slice(1).map((n: number): number => n / 4)
      let mq = [...mqSmall.slice(0, 1), ...mqMediumUp]
      expect(getSrcsetSizes({ s: '50vw', m: '25vw' })).toEqual(expect.arrayContaining(mq))
    })

    it('SHOULD return an array containing the pixel equivalent of 50VW small/medium and 25vw for large up', () => {
      let values = Object.values(MediaQueriesDefault)
      let mqSmall = values.slice(0).map((n: number): number => n / 2)
      let mqMediumUp = values.slice(2).map((n: number): number => n / 4)
      let mq = [...mqSmall.slice(0, 2), ...mqMediumUp]
      expect(getSrcsetSizes({ s: '50vw', l: '25vw' })).toEqual(expect.arrayContaining(mq))
    })

    describe('AND no smallest MQ provided - default to 100vw', () => {
      it('SHOULD return an array containing the pixel equivalent of 50VW', () => {
        const mq = Object.values(MediaQueriesDefault).map((n: number): number => n / 2)
        expect(getSrcsetSizes({ s: '50vw' })).toEqual(expect.arrayContaining(mq))
      })

      it('SHOULD return an array containing the pixel equivalent of 50VW starting from Medium', () => {
        let values = Object.values(MediaQueriesDefault)
        let mq = values.slice(1).map((n: number): number => n / 2)
        mq = [...values.slice(0, 1), ...mq]
        expect(getSrcsetSizes({ m: '50vw' })).toEqual(expect.arrayContaining(mq))
      })

      it('SHOULD return an array containing the pixel equivalent of 50VW starting from Large', () => {
        let values = Object.values(MediaQueriesDefault)
        let mq = values.slice(2).map((n: number): number => n / 2)
        mq = [...values.slice(0, 2), ...mq]
        expect(getSrcsetSizes({ l: '50vw' })).toEqual(expect.arrayContaining(mq))
      })

      it('SHOULD return an array containing the pixel equivalent of 50VW starting from XLarge', () => {
        let values = Object.values(MediaQueriesDefault)
        let mq = values.slice(3).map((n: number): number => n / 2)
        mq = [...values.slice(0, 3), ...mq]
        expect(getSrcsetSizes({ xl: '50vw' })).toEqual(expect.arrayContaining(mq))
      })

      it('SHOULD return an array containing the pixel equivalent of 50VW starting from XXLarge', () => {
        let values = Object.values(MediaQueriesDefault)
        let mq = values.slice(4).map((n: number): number => n / 2)
        mq = [...values.slice(0, 4), ...mq]
        expect(getSrcsetSizes({ xxl: '50vw' })).toEqual(expect.arrayContaining(mq))
      })
    })
  })
})

describe('getMaxNumOfSizes', () => {
  let sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  it('SHOULD return maximum X number of sizes', () => {
    expect(getMaxNumOfSizes(sizes, 5)).toHaveLength(5)
  })

  it('SHOULD return sizes that are not too close to each other', () => {
    expect(getMaxNumOfSizes(sizes, 1)).toEqual([10])
    expect(getMaxNumOfSizes(sizes, 2)).toEqual([5, 10])
    expect(getMaxNumOfSizes(sizes, 3)).toEqual([2, 6, 10])
    expect(getMaxNumOfSizes(sizes, 4)).toEqual([1, 4, 7, 10])
    expect(getMaxNumOfSizes(sizes, 5)).toEqual([2, 4, 6, 8, 10])
    expect(getMaxNumOfSizes(sizes, 6)).toEqual([1, 2, 4, 6, 8, 10])
    expect(getMaxNumOfSizes(sizes, 7)).toEqual([1, 2, 3, 4, 6, 8, 10])
    expect(getMaxNumOfSizes(sizes, 8)).toEqual([1, 2, 3, 4, 5, 6, 8, 10])
    expect(getMaxNumOfSizes(sizes, 9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 10])
    expect(getMaxNumOfSizes(sizes, 10)).toEqual(sizes)
    expect(getMaxNumOfSizes([100, 565, 1284, 351], 2)).toEqual([351, 1284])
    expect(getMaxNumOfSizes([100, 200, 300, 400, 500, 600, 700, 800, 900], 3)).toEqual([
      300,
      600,
      900
    ])
  })

  it('SHOULD throw an error if max is greater than sizes length', () => {
    expect(() => getMaxNumOfSizes(sizes, 100)).toThrow()
    expect(() => getMaxNumOfSizes(sizes, 1)).not.toThrow()
  })
})

describe('getImgSizeStrings', () => {
  it(`SHOULD combine the media query and the size provided to create a size string
			i.e. (min-width: 641px) 280px, (min-width: 1025px) 50vw
		`, () => {
    const sizeStringArr = ['(min-width:1025px) 320px', '50vw']
    expect(getImgSizeStrings({ s: '50vw', l: '320px' }, MediaQueriesDefault)).toEqual(
      expect.arrayContaining(sizeStringArr)
    )
    expect(getImgSizeStrings({ s: '50vw', l: '320px' })).toEqual(
      expect.arrayContaining(sizeStringArr)
    )
  })
})

describe('getRetinaSizes', () => {
  it('SHOULD return retina sizes of a given array', () => {
    expect(getRetinaSizes([1, 2, 3], 2)).toEqual([1, 2, 3, 4, 6])
  })

  it('SHOULD handle multiple multipliers', () => {
    expect(getRetinaSizes([3], 2, 3, 4)).toEqual([3, 6, 9, 12])
  })
})

describe('getSizesWithInterval', () => {
  it('SHOULD get sizes that has an interval of the given param', () => {
    expect(getSizesWithInterval([100, 150, 200, 350, 400], 100)).toEqual([100, 200, 400])
    expect(getSizesWithInterval([20, 100, 150, 200, 350, 400, 600, 900, 950, 1200], 100)).toEqual([
      100,
      200,
      400,
      600,
      950,
      1200
    ])
    expect(getSizesWithInterval([20, 30, 50, 80, 90, 100, 200], 20)).toEqual([30, 50, 80, 100, 200])
  })
})
