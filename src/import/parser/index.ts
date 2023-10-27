interface LineObject {
	tabs: number;
	line: string;
	childs: LineObject[];
	parent: LineObject | null;
}

export default class Parser {
	private core: LineObject = {tabs: -1, line: '', childs: [], parent: null};
	private pointer: LineObject = this.core;

	constructor() {}

	private getTabsCountFromLine = (line: string): number => {
		const [spaces] = line.match(/^[\s]*/g);

		return spaces.length / 2;
	};

	private addChild(tabs: number, line: string): void {
		const child = {tabs, line, childs: [], parent: this.pointer};
		this.pointer.childs.push(child);
		this.pointer = child;
	}

	private processLine(tabs: number, line: string): void {
		if (this.pointer.tabs < tabs) {
			this.addChild(tabs, line);
			return;
		}

		const tabDifference = this.pointer.tabs - tabs + 1;
		for (let i = 0; i < tabDifference; i++) {
			this.pointer = this.pointer.parent;
		}

		this.addChild(tabs, line);
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	private buildChilds(lineObjects: LineObject[]): Record<string, any> {
		const result: Record<string, any> = {};

		for (const {line, childs} of lineObjects) {
			const [key, value] = line.includes(':') ? line.split(':') : [line];

			if (value !== undefined) {
				result[key] = value.trim();
			} else {
				const processedElements = this.buildChilds(childs);

				if (!result[key]) {
					result[key] = processedElements;
				} else {
					if (!Array.isArray(result[key])) {
						result[key] = [result[key]];
					}

					/* eslint-disable @typescript-eslint/no-unsafe-member-access */
					result[key].push(processedElements);
				}
			}
		}

		return result;
	}

	public parse(data: string): void {
		const lines = data.split('\n').filter((el) => el);

		for (const line of lines) {
			this.processLine(this.getTabsCountFromLine(line), line.trim());
		}
	}

	public build(): Record<string, any> {
		return this.buildChilds(this.core.childs);
	}
}
