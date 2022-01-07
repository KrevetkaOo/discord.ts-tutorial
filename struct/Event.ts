import { ExtendedClient } from './ExtendedClient';

export abstract class Event {
	constructor(public client: ExtendedClient, public readonly name: string, public readonly once: boolean = false) {}

	public abstract run(...args: any[]): any;
}
