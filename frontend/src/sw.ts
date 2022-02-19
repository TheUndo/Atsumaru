

setInterval(() => {
    doGarbageCollect();
}, 1000 * 60 * 5);

setTimeout(() => {
    doGarbageCollect();
}, 1000);

export function doGarbageCollect() {
    const keys = Object.assign({}, window.localStorage);
    console.log("Collecting garbage");
    for (const [key, value] of Object.entries(keys)) {
        if (key.startsWith("__useCache"))
            localStorage.removeItem(key);
    }
}





export default {};