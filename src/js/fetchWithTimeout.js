export default async function fetchWithT(url,opt) {
    var controller = new AbortController();
    var td = setTimeout(() => controller.abort(),opt.timeout ?? 100000);
    var resp = await fetch(url,{ ...opt, signal: controller.signal });
    clearTimeout(td);
    return resp;
}