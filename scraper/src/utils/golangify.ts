export default async function goLangify<T, E = unknown>(promise: Promise<T>) {
    try {
        return [await promise, null] as const;
    } catch (e) {
        return [null, e as E] as const;
    }
}