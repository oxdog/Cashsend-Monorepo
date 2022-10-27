module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'inline-dotenv',
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@assets': './assets',
            '@components': './components',
            '@config': './config',
            '@generated': './generated',
            '@graphql': './graphql',
            '@hooks': './hooks',
            '@redux': './redux',
            '@screens': './screens',
            '@types': './types',
            '@utils': './utils'
          }
        }
      ]
    ]
  }
}
