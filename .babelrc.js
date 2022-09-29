module.exports = {
  'presets': [
    '@vue/babel-preset-jsx',
    'es2016',
    [
      '@babel/preset-env',
      {
        modules: 'auto',
        'targets': {
          'node': true
        }
      }
    ]
  ]
};
