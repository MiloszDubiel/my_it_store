export interface AllegroToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; 
}

export let allegroToken: AllegroToken | null = null;

export const setAllegroToken = (token: AllegroToken) => {
  allegroToken = token;
};