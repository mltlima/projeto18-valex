export async function isValid(item: any, text: string) {
    if (!item) {
        throw new Error(text);
    }
}