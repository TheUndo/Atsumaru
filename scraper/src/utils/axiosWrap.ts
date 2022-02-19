import { AxiosResponse } from "axios";
import goLangify from "./golangify";

export default async function aw<T>(response: Promise<readonly [AxiosResponse<any, any>, null] | readonly [null, unknown]>) {
    const [res, error] = await response;

    if (res) {
        return {
            data: res.data as T,
            error: null,
        }
    }

    return {
        data: null,
        error,
    }
} 