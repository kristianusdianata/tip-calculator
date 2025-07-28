export function arrayLoopHandler(datas, handler) {
    for (const [index, data] of datas.entries()) {
        handler(data, index);
    }
}
export function objectLoopHandler(data, handler) {
    Object.entries(data).forEach(([key, value]) => {
        handler(value, key);
    });
}
