export async function getData<T>(url: string, headers?: HeadersInit): Promise<T> {

    const response = await fetch(url, {
        ...(headers && { headers })
    });

    switch (response.status) {

        case 200:
            return response.json() as T;

        case 400:
        case 403: 
        case 404: 
            throw new Error();

        case 500:
        case 502: 
        case 503: 
        case 504:
            throw new Error();

        default: 
            throw new Error();
    }
}