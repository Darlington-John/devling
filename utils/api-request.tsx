import axios, { AxiosRequestConfig, AxiosError } from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */
type ApiRequestOptions = {
	url: string;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, any> | FormData;
	onSuccess?: (response: any) => void;
	onError?: (error: string) => void;
	onFinally?: () => void;
	headers?: Record<string, string>;
};

export const apiRequest = async ({
	url,
	method = 'POST',
	body,
	headers = { 'Content-Type': 'application/json' },
	onSuccess,
	onError,
	onFinally,
}: ApiRequestOptions): Promise<void> => {
	try {
		const isFormData = body instanceof FormData;

		const config: AxiosRequestConfig = {
			url,
			method,
			headers: isFormData ? undefined : headers,
			data: isFormData ? body : body,
		};

		const res = await axios(config);

		if (onSuccess) onSuccess(res.data);
	} catch (error) {
		const err = error as AxiosError<any>;
		if (onError) {
			if (err.response?.data?.error) {
				onError(err.response.data.error);
			} else {
				onError('An error occurred.');
			}
		}
	} finally {
		if (onFinally) onFinally();
	}
};

