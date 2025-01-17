var input = document.createElement("input");
input.type = "file";

var fileReader = new FileReader();

input.onchange = ev => {
    fileReader.readAsArrayBuffer(input.files[0] || new Blob([]));
};

export default function requestFile() {
    input.click();

    return new Promise(resolve => {
        var loadFn = ev => {
            fileReader.removeEventListener("load",loadFn);
            var obj = {
                name: input.files[0]?.name,
                type: input.files[0]?.type,
                arrayBuffer: fileReader.result.slice()
            };
            input.value = "";
            resolve(obj);
        };
        fileReader.addEventListener("load",loadFn);
    });
}