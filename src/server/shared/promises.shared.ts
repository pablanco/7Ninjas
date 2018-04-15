export function DummyPromise(): Promise<boolean> {
    // Returns dummy promise, always true
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
}
