// NAME OF FILE IS ASC.js

// ============================
// PAGE ELEMENTS
// ============================

const testSeriesInput = document.querySelector("#test-series");
const setIdentificationInput = document.querySelector("#set-identification");
const studentNameInput = document.querySelector("#student-name");
const institutionInput = document.querySelector("#institution");


const backendError = document.querySelector("#backend-error");

const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");

const page1 = document.querySelector("#asc-page-1");
const page2 = document.querySelector("#asc-page-2");
const resultPage = document.querySelector("#asc-result-page");


// ============================
// PAGE 2 ELEMENTS
// ============================

const alwaysRightGrid = document.querySelector("#always-right-grid");
const alwaysRightInput = document.querySelector("#always-right-input");
const alwaysRightAddButton = document.querySelector("#always-right-add");
const alwaysRightClearButton = document.querySelector("#always-right-clear");

const autoDownloadButton = document.querySelector("#auto-download-button");
const autoDownloadIndicator = document.querySelector("#auto-download-indicator");

const autoNextButton = document.querySelector("#auto-next-button");
const autoNextIndicator = document.querySelector("#auto-next-indicator");

const answerSheetGrid = document.querySelector("#answer-sheet-grid");

const page2BackButton = document.querySelector("#page-2-back-button");
const page2FinishButton = document.querySelector("#page-2-finish-button");
const page2Error = document.querySelector("#page-2-error");

const page2HelpButton = document.querySelector("#page-2-help-button");
const page2HelpModal = document.querySelector("#page-2-help-modal");
const page2HelpOK = document.querySelector("#page-2-help-ok");

// ============================
// RESULT PAGE ELEMENTS
// ============================

const resultBackButton = document.querySelector("#result-back-button");
const resultNextButton = document.querySelector("#result-next-button");

const resultDownloadButton = document.querySelector("#result-download-button");
const resultDownloadStatus = document.querySelector("#result-download-status");
const resultStudentName = document.querySelector("#result-student-name");

const resultAchievedMarks = document.querySelector("#result-achieved-marks");

const resultPercentage = document.querySelector("#result-percentage");

const resultGrade = document.querySelector("#result-grade");

const resultWrongQuestion = document.querySelector("#result-wrong-question");

const resultUnattemptedQuestion = document.querySelector("#result-unattempted-question");

const resultPDFName = document.querySelector("#result-pdf-name");


// ============================
// CONFIRMATION MODAL
// ============================

const confirmationModal = document.querySelector("#confirmation-modal");
const confirmationMessage = document.querySelector("#confirmation-message");
const confirmationYesButton = document.querySelector("#confirmation-yes");
const confirmationNoButton = document.querySelector("#confirmation-no");

// ============================
// Presistant DB
// ============================

const ASC_DATABASE_NAME = "ExamForge_ASC";
const ASC_DATABASE_VERSION = 1;
const ASC_DATABASE_STORE = "settings";
const ASC_DIRECTORY_KEY = "auto_download_directory";

// ============================
// PAGE 1 DATA
// ============================

let numOfAnswers = null;
let alwaysRight = [];

let autoDownload = false;
let autoNext = false;

let autoDownloadDirectoryHandle = null;

let answerInputs = [];

let builtQuestionCount = null;
let builtTestSeries = null;
let builtSetIdentification = null;

let finishLocked = false;

let confirmationAction = null;

let lastResult = null;
let lastPdfPath = null;

// ============================
// TEST SERIES SELECTOR
// ============================

let tssItems = [];
let tssSearchResult = [];

let tssDateParameters = {
    year: "",
    month: "",
    day: ""
};

let tssTestSeriesParameter = "";

let selectedTestSeriesItem = null;

const tssMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const tssDefaultValue =
    "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u";

// ============================
// TEST SERIES SELECTOR ELEMENTS
// ============================

const tssOpenButton = document.querySelector("#tss-open-button");

const tssModal = document.querySelector("#tss-modal");

const tssVisual = document.querySelector("#tss-visual");

const tssBackButton = document.querySelector("#tss-back");

const tssSearchButton = document.querySelector("#tss-search-button");


// ============================
// TSS DATE
// ============================

const tssDateButton = document.querySelector("#tss-date-button");

const tssDateModal = document.querySelector("#tss-date-modal");

const tssDateYearInput = document.querySelector("#tss-date-year");

const tssDateYearArrow = document.querySelector("#tss-date-year-arrow");

const tssDateYearDropdown = document.querySelector("#tss-date-year-dropdown");

const tssDateMonthInput = document.querySelector("#tss-date-month");

const tssDateMonthArrow = document.querySelector("#tss-date-month-arrow");

const tssDateMonthDropdown = document.querySelector("#tss-date-month-dropdown");

const tssDateDayInput = document.querySelector("#tss-date-day");

const tssDateDayArrow = document.querySelector("#tss-date-day-arrow");

const tssDateDayDropdown = document.querySelector("#tss-date-day-dropdown");

const tssDateBackButton = document.querySelector("#tss-date-back");

const tssDateOKButton = document.querySelector("#tss-date-ok");


// ============================
// TSS TEXT SEARCH
// ============================

const tssTestSeriesButton = document.querySelector("#tss-test-series-button");

const tssTextSearchModal = document.querySelector("#tss-text-search-modal");

const tssTextSearchTitle = document.querySelector("#tss-text-search-title");

const tssTextSearchInput = document.querySelector("#tss-text-search-input");

const tssTextSearchBackButton = document.querySelector("#tss-text-search-back");

const tssTextSearchOKButton = document.querySelector("#tss-text-search-ok");

// ============================
// BACK BUTTON
// ============================

backButton.addEventListener("click", () => {

    openConfirmation(
        "Current data will be lost after this action. Are you sure?",
        () => {

            clearAllASCData();

            location.replace("/");

        }
    );

});


// ============================
// NEXT BUTTON
// ============================

nextButton.addEventListener("click", async () => {

// Clear previous errors

testSeriesInput.classList.remove("invalid");
setIdentificationInput.classList.remove("invalid");
institutionInput.classList.remove("invalid");
studentNameInput.classList.remove("invalid");

backendError.textContent = "";
backendError.classList.remove("active");


// ============================
// GET INPUTS
// ============================

const testSeries = testSeriesInput.value.trim();
const setIdentification = setIdentificationInput.value.trim();
const studentName = studentNameInput.value.trim();
const institution = institutionInput.value.trim();


// ============================
// EMPTY FIELD CHECKS
// ============================

let inputError = false;

if (testSeries === "") {

    testSeriesInput.classList.add("invalid");

    inputError = true;

}

if (setIdentification === "") {

    setIdentificationInput.classList.add("invalid");

    inputError = true;

}

if (institution === "") {

    institutionInput.classList.add("invalid");

    inputError = true;

}

if (testSeries === "Custom" && studentName === "") {

    studentNameInput.classList.add("invalid");

    inputError = true;

}

if (inputError) {

    if (testSeries === "Custom" && studentName === "") {

        backendError.textContent =
            "Student Name cannot be empty for Custom Test Series.";

    } else if (
        testSeries === "" &&
        setIdentification === "" &&
        institution === ""
    ) {

        backendError.textContent =
            "Test Series Name, Set Identification and Institution cannot be empty.";

    } else if (testSeries === "" && setIdentification === "") {

        backendError.textContent =
            "Test Series Name and Set Identification cannot be empty.";

    } else if (testSeries === "" && institution === "") {

        backendError.textContent =
            "Test Series Name and Institution cannot be empty.";

    } else if (setIdentification === "" && institution === "") {

        backendError.textContent =
            "Set Identification and Institution cannot be empty.";

    } else if (testSeries === "") {

        backendError.textContent =
            "Test Series Name cannot be empty.";

    } else if (setIdentification === "") {

        backendError.textContent =
            "Set Identification cannot be empty.";

    } else {

        backendError.textContent =
            "Institution cannot be empty.";

    }

    backendError.classList.add("active");

    return;

}

// ============================
// SEND VERIFICATION REQUEST
// ============================

if (!selectedTestSeriesItem) {
    testSeriesInput.classList.add("invalid");

    backendError.textContent =
        "Please select a Test Series.";

    backendError.classList.add("active");

    return;
}

const verificationData = [
    selectedTestSeriesItem[1],
    setIdentification
];

try {

    const response = await fetch(
        "/Answer-sheet-checker-verify-python-data-sending-gateway",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(verificationData)
        }
    );


    const result = await response.json();


    // ============================
    // BACKEND VERIFICATION
    // ============================

    if (result[0] !== "OK") {

        backendError.textContent = result[0];

        backendError.classList.add("active");

        return;

    }


    // ============================
    // VERIFICATION SUCCESSFUL
    // ============================

    numOfAnswers = Number(result[1]);


    // ============================
    // STORE PAGE 1 DATA
    // ============================

    sessionStorage.setItem(
        "ASC_test_series",
        selectedTestSeriesItem[1]
    );

    sessionStorage.setItem(
        "ASC_set_identification",
        setIdentification
    );

    sessionStorage.setItem(
        "ASC_student_name",
        studentName
    );
    sessionStorage.setItem(
        "ASC_name_of_institution",
        institution
    );

    sessionStorage.setItem(
        "ASC_num_of_answers",
        numOfAnswers
    );
    // ============================
    // SHOW PAGE 2
    // ============================

    preparePage2();

    page1.style.display = "none";
    page2.style.display = "block";
    } catch (error) {

        backendError.textContent =
            "Unable to communicate with the server.";

        console.error(error);

    }
});

// ============================
// TSS  func
// ============================


// ============================
// TSS DATE DROPDOWNS
// ============================

function prepareTSSDateDropdowns(){

    tssDateYearDropdown.innerHTML = "";
    tssDateMonthDropdown.innerHTML = "";
    tssDateDayDropdown.innerHTML = "";

    const currentYear =
        new Date().getFullYear();

    for(
        let year = 2026;
        year <= currentYear;
        year++
    ){

        const option =
            document.createElement("div");

        option.textContent =
            year;

        option.dataset.value =
            String(year);

        tssDateYearDropdown.appendChild(
            option
        );
    }


    tssMonths.forEach(month => {

        const option =
            document.createElement("div");

        option.textContent =
            month;

        option.dataset.value =
            month;

        tssDateMonthDropdown.appendChild(
            option
        );

    });


    for(let day = 1; day <= 31; day++){

        const option =
            document.createElement("div");

        option.textContent =
            day;

        option.dataset.value =
            String(day);

        tssDateDayDropdown.appendChild(
            option
        );

    }
}


function closeTSSDateDropdowns(){

    tssDateYearDropdown.classList.remove(
        "active"
    );

    tssDateMonthDropdown.classList.remove(
        "active"
    );

    tssDateDayDropdown.classList.remove(
        "active"
    );
}


function normaliseTSSMonth(value){

    const trimmed =
        value.trim();

    if(trimmed === ""){
        return "";
    }

    const monthIndex =
        tssMonths.findIndex(
            month =>
                month.toLowerCase() ===
                trimmed.toLowerCase()
        );

    if(monthIndex !== -1){
        return tssMonths[monthIndex];
    }

    if(/^\d+$/.test(trimmed)){

        const numericMonth =
            Number(trimmed);

        if(
            numericMonth >= 1 &&
            numericMonth <= 12
        ){

            return tssMonths[
                numericMonth - 1
            ];
        }

    }

    return null;
}


function openTSSDatePopup(){

    tssDateYearInput.value =
        tssDateParameters.year;

    tssDateMonthInput.value =
        tssDateParameters.month;

    tssDateDayInput.value =
        tssDateParameters.day;

    closeTSSDateDropdowns();

    tssDateModal.classList.add(
        "active"
    );

}

// ============================
// TSS TEXT SEARCH
// ============================

function openTSSTextSearchPopup(){

    tssTextSearchTitle.textContent =
        "Test Series";

    tssTextSearchInput.value =
        tssTestSeriesParameter;

    tssTextSearchModal.classList.add(
        "active"
    );

    tssTextSearchInput.focus();

}

// ============================
// TSS SEARCH PARAMETER BUILDER
// ============================

function buildTSSSearchParameters(){

    let year =
        tssDefaultValue;

    let month =
        tssDefaultValue;

    let day =
        tssDefaultValue;


    if(tssDateParameters.year !== ""){

        year =
            tssDateParameters.year;
    }


    if(tssDateParameters.month !== ""){

        const monthIndex =
            tssMonths.indexOf(
                tssDateParameters.month
            );

        if(monthIndex !== -1){

            month =
                String(monthIndex + 1)
                    .padStart(2,"0");
        }

    }


    if(tssDateParameters.day !== ""){

        day =
            String(
                Number(tssDateParameters.day)
            ).padStart(2,"0");
    }


    const testSeries =
        tssTestSeriesParameter === ""
            ? tssDefaultValue
            : tssTestSeriesParameter;


    return {
        year,
        month,
        day,
        test_series: testSeries
    };
}

// ============================
// LOAD TEST SERIES
// ============================

async function loadTestSeries(){

    const response =
        await fetch(
            "/Answer-sheet-checker-python-data-sending-gateway-for-Test-series-view",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify("")
            }
        );


    if(!response.ok){

        throw new Error(
            "Test Series request failed: " +
            response.status
        );
    }


    const data =
        await response.json();

    tssItems = [
        ...data,
        [
            ["Custom"],
            "JSON/Archive/storage/Custom"
        ]
    ];

    tssSearchResult =
        tssItems;

    refreshTSSVisual(
        tssItems
    );
}

// ============================
// TSS RESULT DISPLAY
// ============================

function refreshTSSVisual(data){

    tssVisual.innerHTML = "";

    if(
        !data ||
        data.length === 0
    ){

        const empty =
            document.createElement("div");

        empty.className =
            "asc-tss-empty";

        empty.textContent =
            "No Test Series found.";

        tssVisual.appendChild(
            empty
        );

        return;
    }


    data.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            "asc-tss-row";


        const information =
            document.createElement("div");

        information.className =
            "asc-tss-item-information";


        const testSeries =
            document.createElement("div");

        testSeries.className =
            "asc-tss-item-name";

        testSeries.textContent =
            "Test series: " +
            item[0][0];


        const created =
            document.createElement("div");

        created.className =
            "asc-tss-item-details";


        if(item[0].length > 1){

            created.textContent =
                "Created on: " +
                item[0][1].join(" ");

        }


        information.appendChild(
            testSeries
        );


        if(item[0].length > 1){

            information.appendChild(
                created
            );

        }


        const actions =
            document.createElement("div");

        actions.className =
            "asc-tss-item-buttons";


        const select =
            document.createElement("button");

        select.type =
            "button";

        select.className =
            "asc-tss-select-button";

        select.textContent =
            "Select";


        select.addEventListener(
            "click",
            () => {

                selectedTestSeriesItem =
                    item;

                testSeriesInput.value =
                    item[0][0];

                tssModal.classList.remove(
                    "active"
                );

            }
        );


        actions.appendChild(
            select
        );


        row.appendChild(
            information
        );

        row.appendChild(
            actions
        );


        tssVisual.appendChild(
            row
        );

    });
}

// ============================
// TSS SEARCH
// ============================

async function searchTestSeries(){

    const parameters =
        buildTSSSearchParameters();

    if(
        parameters.year === tssDefaultValue &&
        parameters.month === tssDefaultValue &&
        parameters.day === tssDefaultValue &&
        parameters.test_series === tssDefaultValue
    ){

        refreshTSSVisual(
            tssItems
        );

        return;
    }

    const response =
        await fetch(
            "/ASC/search-result",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify(
                        parameters
                    )
            }
        );


    if(!response.ok){

        throw new Error(
            "TSS search failed: " +
            response.status
        );
    }


    const data =
        await response.json();


    tssSearchResult =
        data;


    refreshTSSVisual(
        data
    );
}

// ============================
// TSS MAIN POPUP
// ============================

async function openTSSPopup(){

    tssModal.classList.add(
        "active"
    );


    try{

        await loadTestSeries();

    }

    catch(error){

        console.error(
            "Failed to load Test Series:",
            error
        );


        tssVisual.innerHTML = "";


        const errorElement =
            document.createElement("div");

        errorElement.className =
            "asc-tss-empty";

        errorElement.textContent =
            "Failed to load Test Series.";


        tssVisual.appendChild(
            errorElement
        );

    }

}


function resetTSSSearch(){

    tssDateParameters = {
        year:"",
        month:"",
        day:""
    };

    tssTestSeriesParameter =
        "";

    tssDateYearInput.value =
        "";

    tssDateMonthInput.value =
        "";

    tssDateDayInput.value =
        "";

    tssTextSearchInput.value =
        "";
}


function closeTSSPopup(){

    resetTSSSearch();

    tssModal.classList.remove(
        "active"
    );
}



// ============================
// Page 2  func
// ============================

function ensureAnswerSheetGrid(){

    const currentTestSeries =
        testSeriesInput.value.trim();

    const currentSetIdentification =
        setIdentificationInput.value.trim();


    if(
        builtQuestionCount === numOfAnswers &&
        builtTestSeries === currentTestSeries &&
        builtSetIdentification === currentSetIdentification
    ){

        return;

    }


    answerSheetGrid.innerHTML = "";

    answerInputs = [];


    for(
        let rowStart = 1;
        rowStart <= numOfAnswers;
        rowStart += 10
    ){

        const row =
            document.createElement("div");

        row.className =
            "asc-answer-row";


        for(
            let questionNumber = rowStart;
            questionNumber < rowStart + 10 &&
            questionNumber <= numOfAnswers;
            questionNumber++
        ){

            const cell =
                document.createElement("div");

            cell.className =
                "asc-answer-cell";


            const number =
                document.createElement("span");

            number.className =
                "asc-question-number";

            number.textContent =
                questionNumber;


            const input =
                document.createElement("input");

            input.className =
                "asc-answer-input";

            input.type = "text";

            input.inputMode = "numeric";

            input.maxLength = 1;

            input.autocomplete = "off";

            input.dataset.question =
                questionNumber;


            input.addEventListener(
                "keydown",
                (event) => {

                    if(event.key !== "Backspace"){

                        return;

                    }


                    if(input.value === ""){

                        return;

                    }


                    event.preventDefault();


                    input.value = "";


                    const currentIndex =
                        answerInputs.indexOf(input);

                    const previousInput =
                        answerInputs[currentIndex - 1];


                    if(
                        previousInput &&
                        previousInput.value !== ""
                    ){

                        previousInput.focus();

                    }

                }
            );


            input.addEventListener(
                "input",
                () => {

                    input.value =
                        input.value
                            .replace(/[^1-4]/g, "")
                            .slice(0, 1);


                    if(input.value === ""){

                        return;

                    }


                    const currentIndex =
                        answerInputs.indexOf(input);

                    const nextInput =
                        answerInputs[currentIndex + 1];


                    if(
                        nextInput &&
                        nextInput.value === ""
                    ){

                        nextInput.focus();

                    }

                }
            );

            cell.appendChild(number);

            cell.appendChild(input);

            row.appendChild(cell);

            answerInputs.push(input);

        }


        answerSheetGrid.appendChild(row);

    }


    builtQuestionCount =
        numOfAnswers;

    builtTestSeries =
        currentTestSeries;

    builtSetIdentification =
        currentSetIdentification;

}

function preparePage2(){

    ensureAnswerSheetGrid();

    alwaysRightInput.value = "";

    page2Error.textContent = "";
    page2Error.classList.remove("active");

    finishLocked = false;

    renderAlwaysRight();

    setPage2EditingEnabled(true);

}

function renderAlwaysRight(){

    alwaysRightGrid.innerHTML = "";


    alwaysRight.sort(
        (a, b) => a - b
    );


    for(
        let rowStart = 0;
        rowStart < alwaysRight.length;
        rowStart += 3
    ){

        const row =
            document.createElement("div");

        row.className =
            "asc-always-right-row";


        for(
            let column = 0;
            column < 3;
            column++
        ){

            const cell =
                document.createElement("div");

            cell.className =
                "asc-always-right-number";


            const arrayIndex =
                rowStart + column;


            if(arrayIndex < alwaysRight.length){

                cell.textContent =
                    alwaysRight[arrayIndex];

            }
            else{

                cell.classList.add("empty");

            }


            row.appendChild(cell);

        }


        alwaysRightGrid.appendChild(row);

    }

}

function openConfirmation(message, action) {

    confirmationMessage.textContent = message;

    confirmationAction = action;

    confirmationModal.style.display = "flex";

}

function closeConfirmation() {

    confirmationModal.style.display = "none";

    confirmationAction = null;

}

function clearAlwaysRight() {

    alwaysRight = [];

    alwaysRightInput.value = "";
    alwaysRightInput.dataset.previousValue = "";

    alwaysRightInput.classList.remove("invalid");

    renderAlwaysRight();

}

function openASCDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                ASC_DATABASE_NAME,
                ASC_DATABASE_VERSION
            );

        request.onupgradeneeded = () => {

            const database = request.result;

            if (!database.objectStoreNames.contains(ASC_DATABASE_STORE)) {

                database.createObjectStore(
                    ASC_DATABASE_STORE
                );

            }

        };

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });
}

async function saveDirectoryHandle(handle) {

    const database =
        await openASCDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                ASC_DATABASE_STORE,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                ASC_DATABASE_STORE
            );

        store.put(
            handle,
            ASC_DIRECTORY_KEY
        );

        transaction.oncomplete = () => {

            database.close();

            resolve();

        };

        transaction.onerror = () => {

            database.close();

            reject(transaction.error);

        };

    });

}

async function deleteStoredDirectoryHandle() {

    const database =
        await openASCDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                ASC_DATABASE_STORE,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                ASC_DATABASE_STORE
            );

        store.delete(
            ASC_DIRECTORY_KEY
        );

        transaction.oncomplete = () => {

            database.close();

            resolve();

        };

        transaction.onerror = () => {

            database.close();

            reject(transaction.error);

        };

    });

}

function updateAutoDownloadButton(){

    autoDownloadButton.classList.toggle(
        "on",
        autoDownload
    );

    autoDownloadIndicator.classList.toggle(
        "on",
        autoDownload
    );

    autoDownloadIndicator.classList.toggle(
        "off",
        !autoDownload
    );

}

function updateAutoNextButton(){

    autoNextButton.disabled =
        !autoDownload;

    autoNextButton.classList.toggle(
        "on",
        autoNext
    );

    autoNextIndicator.classList.toggle(
        "on",
        autoNext
    );

    autoNextIndicator.classList.toggle(
        "off",
        !autoNext
    );

}

async function autoSavePDF(pdfPath){

    if(!autoDownloadDirectoryHandle){

        throw new Error(
            "No Auto Download folder is selected."
        );

    }


    const permission =
        await autoDownloadDirectoryHandle.queryPermission({
            mode: "readwrite"
        });


    if(permission !== "granted"){

        throw new Error(
            "Auto Download folder permission is no longer granted. Toggle Auto Download off and on again."
        );

    }


    const response =
        await fetch(pdfPath);


    if(!response.ok){

        throw new Error(
            "Unable to retrieve the generated PDF."
        );

    }


    const pdfBlob =
        await response.blob();


    const filename =
        decodeURIComponent(
            pdfPath.split("/").pop()
        );


    const fileHandle =
        await autoDownloadDirectoryHandle.getFileHandle(
            filename,
            {
                create: true
            }
        );


    const writable =
        await fileHandle.createWritable();


    try{

        await writable.write(pdfBlob);

        await writable.close();

    }
    catch(error){

        try{

            await writable.abort();

        }
        catch(abortError){

            console.error(abortError);

        }

        throw error;

    }

}

function buildCheckingData(){

    const answers = [];


    for(const input of answerInputs){

        if(input.value === ""){

            answers.push("");

        }
        else{

            answers.push(
                Number(input.value)
            );

        }

    }


    return {

        test_series:
            sessionStorage.getItem(
                "ASC_test_series"
            ),

        set_code:
            sessionStorage.getItem(
                "ASC_set_identification"
            ),

        answer:
            answers,

        always_right:
            [...alwaysRight],

        student_name:
            sessionStorage.getItem(
                "ASC_student_name"
            ) ?? "",

        name_of_institution:
            sessionStorage.getItem(
                "ASC_name_of_institution"
            )

    };

}

function setPage2EditingEnabled(enabled) {

    answerInputs.forEach(input => {

        input.disabled = !enabled;

    });

    alwaysRightInput.disabled = !enabled;
    alwaysRightAddButton.disabled = !enabled;
    alwaysRightClearButton.disabled = !enabled;

    autoDownloadButton.disabled = !enabled;

    if (enabled) {
        autoNextButton.disabled = !autoDownload;
    } else {
        autoNextButton.disabled = true;
    }

    page2BackButton.disabled = !enabled;

    page2FinishButton.disabled = !enabled;

}

async function finishChecking(){

    if(finishLocked){

        return;

    }


    finishLocked = true;

    setPage2EditingEnabled(false);


    page2Error.textContent = "";

    page2Error.classList.remove(
        "active"
    );


    const checkingData =
        buildCheckingData();


    try{

        const response =
            await fetch(
                "/Answer-sheet-checker-data-python-data-sending-gateway",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(checkingData)
                }
            );


        if(!response.ok){

            throw new Error(
                "Server returned an error."
            );

        }


        const responseData =
            await response.json();


        lastResult =
            responseData.result;

        lastPdfPath =
            responseData.pdf_path;


        if(
            !lastResult ||
            !lastPdfPath
        ){

            throw new Error(
                "Invalid response from server."
            );

        }


        // ============================
        // AUTO NEXT
        // ============================

        if(autoNext){

            if(autoDownload){

                try{

                    await autoSavePDF(
                        lastPdfPath
                    );

                }
                catch(error){

                    page2Error.textContent =
                        "Automatic PDF save failed. Toggle Auto Download off and on again.";

                    page2Error.classList.add(
                        "active"
                    );

                    console.error(error);

                    finishLocked = false;

                    setPage2EditingEnabled(
                        true
                    );

                    return;

                }

            }


            prepareForAutoNext();


            page2.style.display =
                "none";

            page1.style.display =
                "block";


            finishLocked = false;

            setPage2EditingEnabled(
                true
            );


            return;

        }

        function showResultPage(){

            resultStudentName.textContent =
                lastResult.student_name === ""
                    ? "Not Provided"
                    : lastResult.student_name;

            resultAchievedMarks.textContent =
                lastResult.achieved_marks;

            resultPercentage.textContent =
                lastResult.percentage;

            resultGrade.textContent =
                lastResult.grade;

            resultWrongQuestion.textContent =
                lastResult.wrong_question;

            resultUnattemptedQuestion.textContent =
                lastResult.unattempted_question;


            resultPDFName.textContent =
                decodeURIComponent(
                    lastPdfPath.split("/").pop()
                );

        }

        // ============================
        // RESULT PAGE
        // ============================

        page2.style.display =
            "none";

        resultPage.style.display =
            "block";

        showResultPage();

        finishLocked = false;


        // ============================
        // AUTO DOWNLOAD
        // ============================

        if(autoDownload){

            requestAnimationFrame(
                async () => {

                    try{

                        await autoSavePDF(
                            lastPdfPath
                        );


                        if(resultDownloadStatus){

                            resultDownloadStatus.textContent =
                                "PDF saved automatically.";

                        }

                    }
                    catch(error){

                        if(resultDownloadStatus){

                            resultDownloadStatus.textContent =
                                "Automatic PDF save failed. You can download the PDF manually.";

                        }

                        console.error(error);

                    }

                }
            );

        }

    }
    catch(error){

        page2Error.textContent =
            "Unable to complete the answer sheet checking.";

        page2Error.classList.add(
            "active"
        );

        console.error(error);

        finishLocked = false;

        setPage2EditingEnabled(
            true
        );

    }

}

function prepareForAutoNext(){

    // Page 1 values that must be cleared

    setIdentificationInput.value = "";

    studentNameInput.value = "";


    setIdentificationInput.classList.remove(
        "invalid"
    );

    studentNameInput.classList.remove(
        "invalid"
    );



    // Remove from sessionStorage

    sessionStorage.removeItem(
        "ASC_set_identification"
    );

    sessionStorage.removeItem(
        "ASC_student_name"
    );


    // Clear actual answers

    for(const input of answerInputs){

        input.value = "";

    }


    // Clear temporary Always Right input

    alwaysRightInput.value = "";

}

function clearAllASCData(){

    // ============================
    // SESSION STORAGE
    // ============================

    sessionStorage.removeItem(
        "ASC_test_series"
    );

    sessionStorage.removeItem(
        "ASC_set_identification"
    );

    sessionStorage.removeItem(
        "ASC_student_name"
    );

    sessionStorage.removeItem(
        "ASC_name_of_institution"
    );

    sessionStorage.removeItem(
        "ASC_num_of_answers"
    );


    // ============================
    // PAGE 1
    // ============================

    testSeriesInput.value = "";

    setIdentificationInput.value = "";

    studentNameInput.value = "";

    institutionInput.value = "";


    testSeriesInput.classList.remove(
        "invalid"
    );

    setIdentificationInput.classList.remove(
        "invalid"
    );

    institutionInput.classList.remove(
        "invalid"
    );


    backendError.textContent = "";

    backendError.classList.remove(
        "active"
    );


    // ============================
    // ALWAYS RIGHT
    // ============================

    alwaysRight = [];

    alwaysRightInput.value = "";

    alwaysRightInput.classList.remove(
        "invalid"
    );

    renderAlwaysRight();


    // ============================
    // ANSWERS
    // ============================

    for(const input of answerInputs){

        input.value = "";

    }

    answerInputs = [];

    answerSheetGrid.innerHTML = "";


    // ============================
    // TOGGLE STATES
    // ============================

    autoDownload = false;

    autoNext = false;

    autoDownloadDirectoryHandle =
        null;


    updateAutoDownloadButton();

    updateAutoNextButton();


    // ============================
    // INTERNAL STATE
    // ============================

    numOfAnswers = null;

    builtQuestionCount = null;

    builtTestSeries = null;

    builtSetIdentification = null;

    finishLocked = false;

    lastResult = null;

    lastPdfPath = null;

    // ============================
    // MODAL
    // ============================

    confirmationModal.style.display =
        "none";

    confirmationAction = null;


    // ============================
    // ERRORS / RESULT
    // ============================

    page2Error.textContent = "";

    page2Error.classList.remove(
        "active"
    );


    if(resultDownloadStatus){

        resultDownloadStatus.textContent = "";

    }


    // ============================
    // RETURN TO PAGE 1 STATE
    // ============================

    page2.style.display =
        "none";

    resultPage.style.display =
        "none";

    page1.style.display =
        "block";

}

async function getStoredDirectoryHandle(){

    const database =
        await openASCDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                ASC_DATABASE_STORE,
                "readonly"
            );

        const store =
            transaction.objectStore(
                ASC_DATABASE_STORE
            );


        const request =
            store.get(ASC_DIRECTORY_KEY);


        request.onsuccess = () => {

            database.close();

            resolve(
                request.result || null
            );

        };


        request.onerror = () => {

            database.close();

            reject(request.error);

        };

    });

}

async function downloadPDFManually(){

    if(!lastPdfPath){

        return;

    }


    try{

        const response =
            await fetch(lastPdfPath);


        if(!response.ok){

            throw new Error(
                "Unable to retrieve the PDF."
            );

        }


        const pdfBlob =
            await response.blob();


        const downloadURL =
            URL.createObjectURL(
                pdfBlob
            );


        const filename =
            decodeURIComponent(
                lastPdfPath.split("/").pop()
            );


        const link =
            document.createElement("a");

        link.href =
            downloadURL;

        link.download =
            filename;


        document.body.appendChild(link);

        link.click();

        link.remove();


        URL.revokeObjectURL(
            downloadURL
        );

    }
    catch(error){

        if(resultDownloadStatus){

            resultDownloadStatus.textContent =
                "Unable to download the PDF.";

        }

        console.error(error);

    }

}

// ============================
// TSS event handler
// ============================

// ============================
// TSS OPEN
// ============================

tssOpenButton.addEventListener(
    "click",
    () => {

        openTSSPopup();

    }
);


// ============================
// TSS BACK
// ============================

tssBackButton.addEventListener(
    "click",
    () => {

        closeTSSPopup();

    }
);


// ============================
// TSS SEARCH
// ============================

tssSearchButton.addEventListener(
    "click",
    async () => {

        try{

            await searchTestSeries();

        }

        catch(error){

            console.error(
                "TSS search failed:",
                error
            );

        }

    }
);


// ============================
// TSS DATE
// ============================

tssDateButton.addEventListener(
    "click",
    openTSSDatePopup
);


tssDateYearArrow.addEventListener(
    "click",
    () => {

        closeTSSDateDropdowns();

        tssDateYearDropdown
            .classList.toggle("active");

    }
);


tssDateMonthArrow.addEventListener(
    "click",
    () => {

        closeTSSDateDropdowns();

        tssDateMonthDropdown
            .classList.toggle("active");

    }
);


tssDateDayArrow.addEventListener(
    "click",
    () => {

        closeTSSDateDropdowns();

        tssDateDayDropdown
            .classList.toggle("active");

    }
);

tssDateYearDropdown.addEventListener(
    "click",
    event => {

        const option =
            event.target.closest(
                "[data-value]"
            );

        if(!option){
            return;
        }

        tssDateYearInput.value =
            option.dataset.value;

        closeTSSDateDropdowns();

    }
);


tssDateMonthDropdown.addEventListener(
    "click",
    event => {

        const option =
            event.target.closest(
                "[data-value]"
            );

        if(!option){
            return;
        }

        tssDateMonthInput.value =
            option.dataset.value;

        closeTSSDateDropdowns();

    }
);


tssDateDayDropdown.addEventListener(
    "click",
    event => {

        const option =
            event.target.closest(
                "[data-value]"
            );

        if(!option){
            return;
        }

        tssDateDayInput.value =
            option.dataset.value;

        closeTSSDateDropdowns();

    }
);

tssDateOKButton.addEventListener(
    "click",
    () => {

        const year =
            tssDateYearInput.value.trim();

        const month =
            normaliseTSSMonth(
                tssDateMonthInput.value
            );

        const day =
            tssDateDayInput.value.trim();


        if(month === null){
            return;
        }


        if(
            year !== "" &&
            !/^\d{4}$/.test(year)
        ){

            return;
        }


        if(
            day !== "" &&
            (
                !/^\d+$/.test(day) ||
                Number(day) < 1 ||
                Number(day) > 31
            )
        ){

            return;
        }


        tssDateParameters = {
            year,
            month,
            day
        };


        tssDateModal.classList.remove(
            "active"
        );

    }
);


tssDateBackButton.addEventListener(
    "click",
    () => {

        tssDateModal.classList.remove(
            "active"
        );

    }
);

tssTestSeriesButton.addEventListener(
    "click",
    () => {

        openTSSTextSearchPopup();

    }
);


tssTextSearchBackButton.addEventListener(
    "click",
    () => {

        tssTextSearchModal
            .classList.remove("active");

    }
);


tssTextSearchOKButton.addEventListener(
    "click",
    () => {

        tssTestSeriesParameter =
            tssTextSearchInput.value.trim();


        tssTextSearchModal
            .classList.remove("active");

    }
);

prepareTSSDateDropdowns();

// ============================
// Always Right handler
// ============================
// Only allows digits and prevents values greater than numOfAnswers
alwaysRightInput.addEventListener("input", () => {

    const previousValue =
        alwaysRightInput.dataset.previousValue ?? "";

    const newValue =
        alwaysRightInput.value.replace(/\D/g, "");

    if(newValue === ""){

        alwaysRightInput.value = "";
        alwaysRightInput.dataset.previousValue = "";

        alwaysRightInput.classList.remove(
            "invalid"
        );

        return;

    }

    const questionNumber =
        Number(newValue);

    if(questionNumber > numOfAnswers){

        alwaysRightInput.value =
            previousValue;

        return;

    }

    alwaysRightInput.value =
        newValue;

    alwaysRightInput.dataset.previousValue =
        newValue;

    if(questionNumber >= 1){

        alwaysRightInput.classList.remove(
            "invalid"
        );

    }

});
//Add button
alwaysRightAddButton.addEventListener(
"click",
() => {

    const value =
        alwaysRightInput.value.trim();


    alwaysRightInput.classList.remove(
        "invalid"
    );


    if(value === ""){

        return;

    }


    const questionNumber =
        Number(value);


    if(
        !Number.isInteger(questionNumber) ||
        questionNumber < 1 ||
        questionNumber > numOfAnswers
    ){

        alwaysRightInput.classList.add(
            "invalid"
        );

        return;

    }


    if(
        !alwaysRight.includes(
            questionNumber
        )
    ){

        alwaysRight.push(
            questionNumber
        );

        renderAlwaysRight();

    }


    alwaysRightInput.value = "";
    alwaysRightInput.dataset.previousValue = "";

});
confirmationNoButton.addEventListener("click", () => {

    closeConfirmation();

});

confirmationYesButton.addEventListener("click", async () => {

    const action = confirmationAction;

    closeConfirmation();

    if (action) {
        await action();
    }

});

alwaysRightClearButton.addEventListener("click", () => {

    openConfirmation(
        "Clear will remove all of the selected Answers. Are you sure?",
        clearAlwaysRight
    );

});

// ============================
// Auto Download Button
// ============================

autoDownloadButton.addEventListener(
"click",
async () => {

page2Error.textContent = "";

page2Error.classList.remove(
    "active"
);


// ============================
// TURN OFF
// ============================

if(autoDownload){

    autoDownload = false;

    autoNext = false;

    autoDownloadDirectoryHandle =
        null;


    await deleteStoredDirectoryHandle();


    updateAutoDownloadButton();

    updateAutoNextButton();


    return;

}


// ============================
// TURN ON
// ============================

if(
    !window.showDirectoryPicker ||
    !window.isSecureContext
){

    page2Error.textContent =
        "Auto Download is not available in this browser or connection.";

    page2Error.classList.add(
        "active"
    );

    return;

}


try{

    const handle =
        await window.showDirectoryPicker({
            mode: "readwrite"
        });


    const permission =
        await handle.requestPermission({
            mode: "readwrite"
        });


    if(permission !== "granted"){

        page2Error.textContent =
            "Permission to use the selected folder was not granted.";

        page2Error.classList.add(
            "active"
        );

        return;

    }


    autoDownloadDirectoryHandle =
        handle;


    await saveDirectoryHandle(
        handle
    );


    autoDownload = true;

    autoNext = false;


    updateAutoDownloadButton();

    updateAutoNextButton();

}
catch(error){

    if(
        error.name ===
        "AbortError"
    ){

        return;

    }


    page2Error.textContent =
        "Unable to select the Auto Download folder.";

    page2Error.classList.add(
        "active"
    );

    console.error(error);

}

});

// ============================
// Auto Next Button
// ============================

autoNextButton.addEventListener("click", () => {

    if (!autoDownload) {
        return;
    }

    autoNext = !autoNext;

    updateAutoNextButton();

});

// ============================
// PAGE 2 HELP
// ============================

page2HelpButton.addEventListener(
    "click",
    () => {

        page2HelpModal.classList.add(
            "active"
        );

    }
);


page2HelpOK.addEventListener(
    "click",
    () => {

        page2HelpModal.classList.remove(
            "active"
        );

    }
);

// ============================
// Page 2 Back Button
// ============================

page2BackButton.addEventListener("click", () => {

    page2.style.display = "none";
    page1.style.display = "block";

});

// ============================
// Page 2 Finish Button
// ============================

page2FinishButton.addEventListener("click", () => {

    if (finishLocked) {
        return;
    }

    if (autoNext) {

        finishChecking();

        return;

    }

    openConfirmation(
        "No Data can be changed after this action. Are you sure?",
        finishChecking
    );
});

// ============================
// RESULT PAGE BACK
// ============================

resultBackButton.addEventListener(
    "click",
    () => {

        clearAllASCData();

        location.replace("/");

    }
);
// ============================
// RESULT PDF DOWNLOAD
// ============================

resultDownloadButton.addEventListener(
    "click",
    () => {
        downloadPDFManually();
    }
);

// ============================
// RESULT PAGE NEXT
// ============================

resultNextButton.addEventListener(
    "click",
    () => {

        prepareForAutoNext();

        resultPage.style.display =
            "none";

        page1.style.display =
            "block";

    }
);



