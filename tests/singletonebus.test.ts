import { EBus } from "../src";
import { SingletonEBus } from "../src/lib/SingletonEBus";

const SingletonEBusInstance = SingletonEBus.Instance;

test("SingletonEBus should return an instance of EBus", () => {
	expect(SingletonEBusInstance).toBeInstanceOf(EBus);
});

test("SingletonEBus should return the same instance of EBus", () => {
	expect(SingletonEBus.Instance).toBe(SingletonEBusInstance);
});
