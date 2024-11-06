/* eslint-disable @typescript-eslint/naming-convention */
import { isAxiosError } from 'axios';
import { axiosInstance } from './apiConfig';

export function getChoices() {
  return axiosInstance
    .get('/choices')
    .then(response => response.data)
    .catch((error: unknown) => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve choices at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(
          `An unknown error occurred. ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    });
}

export function getFieldChoices(name: string) {
  return axiosInstance
    .get<string[]>(`/choices/${name}`)
    .then(response => response.data)
    .catch((error: unknown) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 422) {
          const validationErrors = error.response.data.detail;
          throw new Error(
            `Validation Error: ${JSON.stringify(validationErrors)}`,
          );
        }
        throw new Error(
          `Unable to retrieve choices for "${name}" at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(
          `An unknown error occurred. ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    });
}
