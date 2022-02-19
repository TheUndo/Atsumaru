/** @param snooze ms */
export default async function sleep(snooze: number) {
    return new Promise(r => setTimeout(r, snooze));
}