type Subscriber = {
	[eventName: string]: {
		[subscriberId: number | string]: Function;
	};
};

type Class = { new(...args: any): any };
type InstanceOfClass = InstanceType<Class>;
type Unsubscribe = () => void;
type Listener<TEvent extends Class> = (event: InstanceType<TEvent>) => void;
type NoInfer<T> = [T][T extends any ? 0 : never];

interface IEBus {
	on<TEvent extends Class>(
		event: TEvent,
		listener: (event: TEvent) => void
	): Unsubscribe;
	send<TEvent extends InstanceOfClass>(event: TEvent): void;
	registerMiddleware<
		TEvent extends Class,
		TEventInstance extends InstanceType<NoInfer<TEvent>>
	>(
		event: TEvent,
		middleware: (event: TEventInstance) => TEventInstance
	): Unsubscribe;
}

export class EBus implements IEBus {
	private currentEventId: number = 0;
	private subscribers: Subscriber = {};
	private middlewares: { [eventName: string]: Function[] } = {};

	public on<TEvent extends Class>(
		event: TEvent,
		listener: Listener<TEvent>
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

		const middlewares = this.middlewares[eventName] || [];
		let currentEvent = event;
		for (const middleware of middlewares) {
			currentEvent = middleware(currentEvent);
		}

		const eventSubscribers = this.subscribers[eventName];
		const eventIds = Object.keys(eventSubscribers);
		eventIds.forEach((eventId) => {
			const listener = eventSubscribers[eventId];
			listener(currentEvent);
		});
	}

	public registerMiddleware<
		TEvent extends Class,
		TEventInstance extends InstanceType<NoInfer<TEvent>>
	>(
		event: TEvent,
		middleware: (event: TEventInstance) => TEventInstance
	): Unsubscribe {
		const eventName = event.prototype.constructor.name;
		if (!this.middlewares[eventName]) {
			this.middlewares[eventName] = [];
		}

		this.middlewares[eventName].push(middleware);

		return () => {
			this.middlewares[eventName] = this.middlewares[eventName].filter(
				(m) => m !== middleware
			);
		};
	}


	private getNextEventId() {
		return this.currentEventId++;
	}
}