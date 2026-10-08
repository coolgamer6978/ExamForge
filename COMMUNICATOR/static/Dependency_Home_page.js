// NAME OF FILE IS Dependency.js


const downloadDependencyButton =
    document.querySelector("#download-dependency");


const openExamForgeButton =
    document.querySelector("#open-examforge");


// ============================
// DOWNLOAD DEPENDENCY
// ============================

downloadDependencyButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "/Dependency";

    }
);


// ============================
// OPEN EXAMFORGE
// ============================

openExamForgeButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "https://" +
            window.location.hostname +
            ":5000";

    }
);