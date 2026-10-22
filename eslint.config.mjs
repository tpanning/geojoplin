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
];
