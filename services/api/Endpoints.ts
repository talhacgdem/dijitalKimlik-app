// export const BASE_URL = "http://192.168.1.110";
export const BASE_URL = "https://sendikapp.okumayadeger.com";
export const BASE_API_URL = BASE_URL + "/api";
export const authLoginUrl = "/auth/login";
export const authLogoutUrl = "/auth/logout";

export const imageUrlBuilder = (image: string) => {

    if (!image) {
        return '';
    }
    return BASE_API_URL + "/disk?image=" + image;
}