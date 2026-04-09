module.exports = {
	'root': true,
	'env': {
		'browser': true,
		'es6': true,
		'node': true,
	},
	'parser': '@typescript-eslint/parser',
	'extends': ['eslint:recommended'],
	'settings': {
		'react': {
			'version': 'detect',
		},
	},
	'globals': {
		'JSX': 'readonly',
		'NodeJS': 'readonly',
	},
	'parserOptions': {
		'ecmaVersion': 2018,
		'ecmaFeatures': {
			'jsx': true,
		},
		'sourceType': 'module',
	},
	'rules': {
		// -------------------------------
		// Code correctness
		// -------------------------------
		'react/jsx-uses-react': 'error',
		'react/jsx-uses-vars': 'error',
		'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		'@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'no-constant-condition': 0,
		'no-prototype-builtins': 0,
		'require-atomic-updates': 0,
		'prefer-const': ['error'],
		'no-var': ['error'],
		'no-new-func': ['error'],
		'import/prefer-default-export': ['error'],
		'prefer-promise-reject-errors': ['error', {
			allowEmptyReject: true,
		}],
		'no-throw-literal': ['error'],
		'no-unused-expressions': ['error'],
		'no-array-constructor': ['error'],
		'radix': ['error'],
		'eqeqeq': ['error', 'always'],
		'no-console': ['error', { 'allow': ['warn', 'error'] }],
        'complexity': ['warn', { max: 10 }],
		'@seiyab/react-hooks/rules-of-hooks': 'error',
		'@seiyab/react-hooks/exhaustive-deps': ['error', { 'ignoreThisDependency': 'props' }],
		'jest/require-top-level-describe': ['error', { 'maxNumberOfTopLevelDescribes': 1 }],
		'jest/no-identical-title': ['error'],
		'jest/prefer-lowercase-title': ['error', { 'ignoreTopLevelDescribe': true }],
		'promise/prefer-await-to-then': 'error',
		'no-unneeded-ternary': 'error',
		'github/array-foreach': ['error'],
		'@typescript-eslint/no-explicit-any': ['error'],
		'no-constant-binary-expression': ['error'],

		// -------------------------------
		// Formatting
		// -------------------------------
		'space-in-parens': ['error', 'never'],
		'space-infix-ops': ['error'],
		'curly': ['error', 'multi-line', 'consistent'],
		'semi': ['error', 'always'],
		'eol-last': ['error', 'always'],
		'quotes': ['error', 'single'],
		'indent': ['error', 'tab'],
		'comma-dangle': ['error', {
			'arrays': 'always-multiline',
			'objects': 'always-multiline',
			'imports': 'always-multiline',
			'exports': 'always-multiline',
			'functions': 'always-multiline',
		}],
		'comma-spacing': ['error', { 'before': false, 'after': true }],
		'no-trailing-spaces': 'error',
		'linebreak-style': ['error', 'unix'],
		'prefer-template': ['error'],
		'template-curly-spacing': ['error', 'never'],
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'never'],
		'key-spacing': ['error', {
			'beforeColon': false,
			'afterColon': true,
			'mode': 'strict',
		}],
		'block-spacing': ['error'],
		'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
		'no-spaced-func': ['error'],
		'func-call-spacing': ['error'],
		'space-before-function-paren': ['error', {
			'anonymous': 'never',
			'named': 'never',
			'asyncArrow': 'always',
		}],
		'multiline-comment-style': ['error', 'separate-lines', { checkJSDoc: true }],
		'space-before-blocks': 'error',
		'spaced-comment': ['error', 'always'],
		'keyword-spacing': ['error', { 'before': true, 'after': true }],
		'no-multi-spaces': ['error'],
		'prefer-object-spread': ['error'],
		'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],

		// Regarding the keyword blacklist:
		// - err: We generally avoid using too many abbreviations, so it should
		//   be "error", not "err"
		// - notebook: In code, it should always be "folder" (not "notebook").
		//   In user-facing text, it should be "notebook".
		'id-denylist': ['error', 'err', 'notebook', 'notebooks'],
		'prefer-arrow-callback': ['error'],
	},
	'plugins': [
		'react',
		'@typescript-eslint',
		'@seiyab/eslint-plugin-react-hooks',
		'import',
		'promise',
		'jest',
		'github',
	],
	'overrides': [
		{
			'files': ['*.ts', '*.tsx'],
			'parserOptions': {
				'project': './tsconfig.eslint.json',
			},
			'rules': {
				'@typescript-eslint/indent': ['error', 'tab', {
					'ignoredNodes': [
						// See https://github.com/typescript-eslint/typescript-eslint/issues/1824
						'TSUnionType',
					],
				}],
				'@typescript-eslint/ban-ts-comment': ['error'],
				'@typescript-eslint/ban-types': 'error',
				'@typescript-eslint/explicit-member-accessibility': ['error'],
				'@typescript-eslint/type-annotation-spacing': ['error', { 'before': false, 'after': true }],
				'@typescript-eslint/array-type': 'error',
				'@typescript-eslint/no-inferrable-types': ['error'],
				'@typescript-eslint/comma-dangle': ['error', {
					'arrays': 'always-multiline',
					'objects': 'always-multiline',
					'imports': 'always-multiline',
					'exports': 'always-multiline',
					'enums': 'always-multiline',
					'generics': 'always-multiline',
					'tuples': 'always-multiline',
					'functions': 'always-multiline',
				}],
				'@typescript-eslint/object-curly-spacing': ['error', 'always'],
				'@typescript-eslint/semi': ['error', 'always'],
				'@typescript-eslint/member-delimiter-style': ['error', {
					'multiline': {
						'delimiter': 'semi',
						'requireLast': true,
					},
					'singleline': {
						'delimiter': 'semi',
						'requireLast': false,
					},
				}],
				'@typescript-eslint/no-floating-promises': ['error'],
				'@typescript-eslint/naming-convention': ['error',
                    {
						selector: 'default',
						format: ['StrictPascalCase', 'strictCamelCase', 'snake_case', 'UPPER_CASE'],
						leadingUnderscore: 'allow',
						trailingUnderscore: 'allow',
					},

					{
						selector: 'enumMember',
						format: ['StrictPascalCase'],
					},
					{
						selector: 'interface',
						format: ['StrictPascalCase'],
					},
				],
			},
		},
	],
};
