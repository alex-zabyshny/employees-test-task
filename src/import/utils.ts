import fs from 'fs/promises';

export const createDir = async (dirPath: string): Promise<void> => {
	try {
		await fs.access(dirPath, fs.constants.F_OK);
	} catch (error: unknown) {
		if ((error as Error).message.includes('ENOENT')) {
			await fs.mkdir(dirPath);
		} else {
			throw error;
		}
	}
};
