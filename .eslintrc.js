module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        '@antfu',
        '@unocss',
        '@cooj/eslint-config-vue',
    ],
    rules: {
        'n/prefer-global/process': [
            'off',
        ],
    },

}
