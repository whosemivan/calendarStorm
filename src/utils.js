export function parse(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
}