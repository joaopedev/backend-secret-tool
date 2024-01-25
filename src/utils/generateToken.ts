export function generateToken(): string {
    const min = 100000;
    const max = 999999;
    const token = Math.floor(Math.random() * (max - min + 1)) + min;
    return token.toString();
}