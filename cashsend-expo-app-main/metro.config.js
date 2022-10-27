const { getDefaultConfig } = require('@expo/metro-config')

// ! Note for later:
// ! even an empty file creates warning
//* maybe it is early EAS build that does not get it

// module.exports = () => {
//   const defaultConfig = getDefaultConfig(__dirname)

//   defaultConfig.transformer.babelTransformerPath = require.resolve(
//     'react-native-svg-transformer'
//   )

//   defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
//     (ext) => ext !== 'svg'
//   )
//   defaultConfig.resolver.sourceExts.push('svg')

//   return defaultConfig
// }

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig(__dirname)

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg']
    }
  }
})()

// module.exports = () => {
//   const {
//     resolver: { sourceExts, assetExts }
//   } = getDefaultConfig(__dirname)

//   // console.log('sourceExts', sourceExts)

//   return {
//     transformer: {
//       babelTransformerPath: require.resolve('react-native-svg-transformer')
//     }
//     // ,
//     // resolver: {
//     //   assetExts: assetExts.filter((ext) => ext !== 'svg'),
//     //   sourceExts: [...sourceExts, 'svg']
//     // }
//   }
// }

// module.exports = {}
