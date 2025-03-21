import Bull from "bull";

export const excelQueue = new Bull('excel', {
    redis: {
        host: '127.0.0.1',
        port: 6379,
        password: 'sourav',
    },
});

export const pdfQueue = new Bull('pdf', {
    redis: {
        host: '127.0.0.1',
        port: 6379,
        password: "sourav"
    }
});