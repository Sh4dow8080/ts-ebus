import { EBus } from "./EBus";

export class SingletonEBus {
	private static instance: EBus = new EBus();

	public static get Instance(): EBus {
		return this.instance;
	}
}
