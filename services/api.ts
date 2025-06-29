export async function fetchData(endpoint: string) {
    const baseUrl = 'https://lapastaia.tr/apiproject/api';
    try {
        const res = await fetch(`${baseUrl}/${endpoint}`);
        return await res.json();
    } catch (err) {
        console.error('API Hatası:', err);
        throw err;
    }
}