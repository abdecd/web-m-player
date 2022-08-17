var input = document.createElement("input");
input.type = "file";

var fileReader = new FileReader();

input.onchange = ev => {
    fileReader.readAsArrayBuffer(input.files[0] || new Blob([]));
};

export default function requestPic() {
    input.click();

    return new Promise(resolve => {
        var loadFn = ev => {
            fileReader.removeEventListener("load",loadFn);
            resolve({
                type: input.files[0]?.type,
                arrayBuffer: fileReader.result
            });
        };
        fileReader.addEventListener("load",loadFn);
    });
}