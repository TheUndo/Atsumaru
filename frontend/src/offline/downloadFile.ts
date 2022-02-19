

export async function downloadFile(url: string) {
    try {
        const response = await fetch(url, {
            mode: "no-cors"
        })

        const blob = await response.blob();

        console.log(URL.createObjectURL(blob));
    } catch (e: any) {
        console.error(e);
        return {
            data: null,
            message: e.toString()
        };
    }

    
}