export async function getData<T>(url: string, headers?: HeadersInit): Promise<T> {

    const response = await fetch(url, {
        ...(headers && { headers })
    });

    if (!response.ok) throw new Error();
    
    return response.json() as T;
}