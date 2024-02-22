type Subscriber = {
	[eventName: string]: {
		[subscriberId: number | string]: Function;
	};
};

type Class = { new (...args: any): any };
type InstanceOfClass = InstanceType<Class>;
type Unsubscribe = () => void;

interface IEBus {
	on<TEvent extends Class>(
		event: TEvent,
		listener: (event: TEvent) => void
	): Unsubscribe;
	send<TEvent extends InstanceOfClass>(event: TEvent): void;
}

export class EBus implements IEBus {
	private currentEventId: number = 0;
	private subscribers: Subscriber = {};

	public on<TEvent extends Class>(
		event: TEvent,
		listener: (event: InstanceType<TEvent>) => void
	): Unsubscribe {
		const eventName = event.prototype.constructor.name;
		const eventId = this.getNextEventId();
		if (!this.subscribers[eventName]) {
			this.subscribers[eventName] = {};
		}
		this.subscribers[eventName][eventId] = listener;
		return () => {
			delete this.subscribers[eventName][eventId];
		};
	}

	public send<TEvent extends InstanceOfClass>(event: TEvent): void {
		const eventName = (event as any).constructor.name;
		if (!this.subscribers[eventName]) {
			return;
		}

		const eventSubscribers = this.subscribers[eventName];
		const eventIds = Object.keys(eventSubscribers);
		eventIds.forEach((eventId) => {
			const listener = eventSubscribers[eventId];
			listener(event);
		});
	}

	private getNextEventId() {
		return this.currentEventId++;
	}
}