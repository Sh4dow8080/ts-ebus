# ts-ebus | Event Bus Library

ts-ebus is a lightweight, efficient, and type-safe event bus library designed for TypeScript and JavaScript applications. It facilitates communication between different parts of your application through a publish/subscribe pattern. This library supports both the instantiation of an EBus object and a Singleton pattern for global access.

## Features

- **Type-Safe Event Handling:** Leverage TypeScript's type system for registering and emitting events.
- **Simple API:** Easy to use API with `on` for subscribing to events and `send` for emitting events.
- **Singleton Support:** Use `SingletonEBus` for a global event bus instance across your application.
- **Automatic Cleanup:** Subscriptions return an `unsubscribe` function for easy cleanup.

## Installation

You can install EBus via npm:

```bash
npm install ts-ebus
```

Replace `ts-ebus` with the actual name of your package.

## Usage

### Importing

```typescript
import { EBus } from 'ts-ebus';
// For using the Singleton pattern
import { SingletonEBus } from 'ts-ebus';
```

### Creating an Event Class

Define an event class for type-safe event handling:

```typescript
class MyEvent {
    constructor(public readonly message: string) {}
}
```

### Subscribing to an Event

Subscribe to events using the `on` method:

```typescript
const bus = new EBus();

const unsubscribe = bus.on(MyEvent, (event) => {
    console.log(event.message);
});
```

### Emitting an Event

Emit events using the `send` method:

```typescript
bus.send(new MyEvent("Hello, world!"));
```

### Using the Singleton Pattern

For global access, use `SingletonEBus`:

```typescript
SingletonEBus.Instance.send(new MyEvent("Hello from Singleton!"));

const unsubscribeSingleton = SingletonEBus.Instance.on(MyEvent, (event) => {
    console.log(event.message);
});
```

### Unsubscribing

To unsubscribe from events, simply call the function returned by the `on` method.

## API Reference

### `EBus`

#### `on<TEvent extends Class>(event: TEvent, listener: (event: InstanceType<TEvent>) => void): Unsubscribe`

Subscribe to an event. Returns an `Unsubscribe` function.

#### `send<TEvent extends InstanceOfClass>(event: TEvent): void`

Emit an event to all its subscribers.

### `SingletonEBus`

#### `static get Instance(): EBus`

Access the singleton instance of `EBus`.

## Contribution

Contributions are welcome! Please feel free to submit pull requests or open issues on our GitHub repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.