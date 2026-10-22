import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import github from 'eslint-plugin-github';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const legacyConfig = require('./.eslintrc.js');
const compat = new FlatCompat({
	baseDirectory: fileURLToPath(new URL('.', import.meta.url)),
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['dist/**', 'dist-electron/**'],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		plugins: { github },
	},
	...compat.config(legacyConfig).map(config => ({
		...config,
		files: ['**/*.ts', '**/*.tsx'],
	})),
	{
		files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
		languageOptions: {
			globals: {
				describe: 'readonly',
				test: 'readonly',
				expect: 'readonly',
			},
		},
	},
	{
		files: ['src/gui/LayerPanel.tsx'],
		languageOptions: {
			globals: {
				__APP_VERSION__: 'readonly',
			},
		},
	},
	{
		files: ['vite.config.ts'],
		rules: {
			'@typescript-eslint/naming-convention': 'off',
		},
	},
	{
		files: ['src/vite-env.d.ts'],
		rules: {
			'spaced-comment': 'off',
			'@typescript-eslint/naming-convention': 'off',
		},
	},
];
