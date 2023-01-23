function ApplyPolyfills() {
    if (!Array.prototype.at) {
        var url = "https://polyfill.io/v3/polyfill.min.js?features=";
        var featureStr = "es2022";
        if (!Promise.any) featureStr += "%2Ces2021";
        if (!Promise.allSettled) featureStr += "%2Ces2020";
        if (!Array.prototype.flat) featureStr += "%2Ces2019";
        var script = document.createElement("script");
        script.src = url+featureStr;
        document.head.appendChild(script);
    }
}

export default ApplyPolyfills;