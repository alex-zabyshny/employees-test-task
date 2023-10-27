import {readFile, writeFile} from 'fs/promises';
import path from 'path';

import Parser from './parser';
import {createDir} from './utils';

(async (): Promise<void> => {
	const parser = new Parser();

	const data = await readFile(path.join(__dirname, '../data/dump.txt'), 'utf-8');

	parser.parse(data);
	const processedData = parser.build();

	await createDir('tmp');
	await writeFile('tmp/parsed.json', JSON.stringify(processedData, null, 1));
})();
