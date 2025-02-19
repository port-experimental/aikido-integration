import axios from 'axios';
import process from "node:process";
import _ from 'lodash';
import { Issue, Repository } from './aikido_types';


interface OAuthResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

async function generateOAuthToken(): Promise<string> {
    const clientId = process.env.AIKIDO_CLIENT_ID;
    const clientSecret = process.env.AIKIDO_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
        throw new Error('AIKIDO_CLIENT_ID and AIKIDO_CLIENT_SECRET must be set in the environment variables');
    }
    
    try {
        const response = await axios.post<OAuthResponse>(
            'https://app.aikido.dev/api/oauth/token', {
                grant_type: 'client_credentials',
            }, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                    'Accept': 'application/json',
                },
            });
        
        return response.data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('OAuth token generation failed:', error.response?.data || error.message);
        } else {
            console.error('An unexpected error occurred:', error);
        }
        throw error;
    }
};

class ApiClient {
    private baseUrl: string;
    private sessionToken: string;
    private static instance: ApiClient;
    
    static async getClient() {
        const baseUrl = 'https://app.aikido.dev/api/public/v1';
        const sessionToken = await generateOAuthToken();

        if (!this.instance) {
            this.instance = new ApiClient(baseUrl, sessionToken);
        }
        return this.instance;
    }
    
    constructor(baseUrl: string, sessionToken: string) {
        this.baseUrl = baseUrl;
        this.sessionToken = sessionToken;
    }
    
    async get(endpoint: string, params: Record<string, string> = {}): Promise<any> {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
        
        const response = await axios.get(url.toString(), {
            headers: {
                'Authorization': `Bearer ${this.sessionToken}`,
                'Accept': 'application/json'
            },
        });
        
        return response.data;
    }
    
    async post(endpoint: string, data: any): Promise<any> {
        const response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
            headers: {
                'Authorization': `Bearer ${this.sessionToken}`,
                'Accept': 'application/json'
            },
        });
        return response;
    }

    async delete(endpoint: string): Promise<any> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${this.sessionToken}`,
            },
        })
        return response;
    }
}

export async function getClient() {
    return ApiClient.getClient();
}

export async function getIssues(): Promise<Issue[]> {
    const client = await ApiClient.getClient();
    return client.get('/issues/export?format=json');
}

export async function getRepositories(): Promise<Repository[]> {
    const client = await ApiClient.getClient();
    return client.get('/repositories/code?per_page=200');
}
