import axios from "axios";

const instance = axios.create({
    baseURL: 'http://coinpusher.local:3000',
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar' }
});

// Create WebSocket connection.
const socket = new WebSocket("ws://coinpusher.local");



export function useApi() {
    return { instance, socket }
}