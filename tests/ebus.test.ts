import { EBus } from "../src";

let bus = new EBus();
beforeEach(() => {
    bus = new EBus();
});

class TestEvent { }
class TestEvent2 { }
class TestEvent3 {
    constructor(public value: string) { }
}

test("EBus on<...> should return an unsubscribe function", () => {
    // Arrange
    const unsubscribe = bus.on(TestEvent, () => { });

    // Assert
    expect(unsubscribe).toBeInstanceOf(Function);
});

test("EBus on<...> should call listener when send<...> is called", () => {
    // Arrange
    const listener = jest.fn();
    bus.on(TestEvent, listener);

    // Act
    bus.send(new TestEvent());

    // Assert
    expect(listener).toHaveBeenCalled();
});

test("EBus on<...> should not call listener after unsubscribe is called", () => {
    // Arrange
    const listener = jest.fn();
    const unsubscribe = bus.on(TestEvent, listener);
    unsubscribe();

    // Act
    bus.send(new TestEvent());

    // Assert
    expect(listener).not.toHaveBeenCalled();
});

test("EBus on<...> should call listener for the correct event", () => {
    // Arrange
    const listener = jest.fn();
    bus.on(TestEvent, listener);

    // Act
    bus.send(new TestEvent2());

    // Assert
    expect(listener).not.toHaveBeenCalled();
});

test("EBus on<...> should call listener with the correct event when using middleware", () => {
    // Arrange
    const listener = jest.fn();
    const middleware = jest.fn((event: TestEvent3) => {
        return new TestEvent3("fisk");
    });

    bus.registerMiddleware(TestEvent3, middleware);
    bus.on(TestEvent3, listener);

    // Act
    bus.send(new TestEvent3("kat"));

    // Assert
    expect(middleware).toHaveBeenCalled();
    expect(middleware).toHaveBeenCalledWith(new TestEvent3("kat"));

    expect(listener).toHaveBeenCalledWith(new TestEvent3("fisk"));
});