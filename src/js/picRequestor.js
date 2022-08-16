var input = document.createElement("input");
input.type = "file";

var fileReader = new FileReader();

input.onchange = ev => {
    if (input.files[0]) fileReader.readAsArrayBuffer(input.files[0]);
};

export default function requestPic() {
    input.click();

    return new Promise(resolve => {
        var loadFn = ev => {
            fileReader.removeEventListener("load",loadFn);
            resolve(ev.target.result);
        };
        fileReader.addEventListener("load",loadFn);
    });
}