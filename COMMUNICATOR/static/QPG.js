//NAME OF FILE IS QPG.js
const finishScreen =
    document.getElementById("finish-screen");

const finishBack =
    document.getElementById("finish-back");

const finishNext =
    document.getElementById("finish-next");

const finishSave =
    document.getElementById("finish-save");

const finishSaveIndicator =
    document.getElementById("finish-save-indicator");

const finishError =
    document.getElementById("finish-error");

const finish2Screen =
    document.getElementById("finish2-screen");

const finish2Back =
    document.getElementById("finish2-back");

const finish2OriginalFiles =
    document.getElementById("finish2-original-files");

const finish2IndividualFiles =
    document.getElementById("finish2-individual-files");

const finish2DuplexQuestions =
    document.getElementById("finish2-duplex-questions");

const finish2DuplexOmr =
    document.getElementById("finish2-duplex-omr");

const finish2SimplexQuestions =
    document.getElementById("finish2-simplex-questions");

const finish2SimplexOmr =
    document.getElementById("finish2-simplex-omr");

const generatorScreen =
    document.getElementById("generator-screen");

const generatorError =
    document.getElementById("generator-error");

const generatorBack =
    document.getElementById("generator-back");

const generatorAdd =
    document.getElementById("generator-add");

const generatorFinish =
    document.getElementById("generator-finish");

const generatorQuestionBody =
    document.getElementById("generator-question-body");

const generatorModal =
    document.getElementById("generator-modal");

const generatorModalMessage =
    document.getElementById("generator-modal-message");

const generatorModalYes =
    document.getElementById("generator-modal-yes");

const generatorModalNo =
    document.getElementById("generator-modal-no");

const fields = [
    "question",
    "option1",
    "option2",
    "option3",
    "option4",
    "answer"
];

const finishData = {
    testSeriesName: "",
    setCode: "",
    time: "",
    totalMarks: "",
    institution: "",
    studentCount: "",
    save: false
};

const generatorQuestionTemplate =
    document.getElementById(
        "generator-question-template"
    );

let modalAction = null;


// ==================================================
// QUESTION ROW HELPERS
// ==================================================

function getRows(){

    return [
        ...generatorQuestionBody.querySelectorAll(
            ".generator-question-row"
        )
    ];

}


function getRowInputs(row){

    return [
        ...row.querySelectorAll(".generator-input")
    ];

}


function getRowData(row){

    const data = {};

    getRowInputs(row).forEach(input => {

        data[input.dataset.field] =
            input.value;

    });

    return data;

}


// ==================================================
// QUESTION VALIDATION
// ==================================================

function validateRow(row){

    const data =
        getRowData(row);

    let valid = true;


    getRowInputs(row).forEach(input => {

        input.classList.remove(
            "invalid"
        );

    });


    // Every field must contain something.

    fields.forEach(field => {

        if(data[field].trim() === ""){

            row
                .querySelector(
                    `[data-field="${field}"]`
                )
                .classList.add(
                    "invalid"
                );

            valid = false;

        }

    });


    // Answer must be exactly 1, 2, 3 or 4.

    if(
        !/^[1-4]$/.test(
            data.answer.trim()
        )
    ){

        row
            .querySelector(
                '[data-field="answer"]'
            )
            .classList.add(
                "invalid"
            );

        valid = false;

    }


    return valid;

}


function validateAllRows(){

    const rows =
        getRows();

    let valid = true;


    rows.forEach(row => {

        if(!validateRow(row)){

            valid = false;

        }

    });


    generatorError.classList.toggle(
        "active",
        !valid
    );


    return valid;

}


// ==================================================
// SERIAL NUMBERING
// ==================================================

function updateSerialNumbers(){

    getRows().forEach(
        (row,index) => {

            row
                .querySelector(
                    ".generator-serial-number"
                )
                .textContent =
                    index + 1;

        }
    );

}


// ==================================================
// CREATE QUESTION ROW
// ==================================================

function createQuestionRow(){

    return generatorQuestionTemplate
        .content
        .firstElementChild
        .cloneNode(true);

}

// ==================================================
// CHECK WHETHER QUESTION DATA EXISTS
// ==================================================

function hasData(){

    return getRows().some(
        row => {

            return getRowInputs(row).some(
                input =>
                    input.value.length > 0
            );

        }
    );

}

// ==================================================
// ADD QUESTION
// ==================================================

generatorAdd.addEventListener(
    "click",
    () => {
        const newRow =
            createQuestionRow();

        generatorQuestionBody.appendChild(
            newRow
        );


        updateSerialNumbers();


        generatorError.classList.remove(
            "active"
        );


        /*
           Scroll the newly created question
           into view.
        */

        newRow.scrollIntoView({
            behavior:"smooth",
            block:"nearest"
        });

    }
);


// ==================================================
// REMOVE QUESTION
// ==================================================

generatorQuestionBody.addEventListener(
    "click",
    event => {

        const removeButton =
            event.target.closest(
                "[data-remove-question]"
            );


        if(!removeButton){

            return;

        }


        const row =
            removeButton.closest(
                ".generator-question-row"
            );


        if(!row){

            return;

        }


        /*
           Keep at least one question row.
           The generator must always have a
           question-entry row available.
        */

        if(
            getRows().length === 1
        ){

            row
                .querySelectorAll(
                    ".generator-input"
                )
                .forEach(input => {

                    input.value = "";
                    input.classList.remove(
                        "invalid"
                    );

                });


            generatorError.classList.remove(
                "active"
            );

            return;

        }


        row.remove();

        updateSerialNumbers();

        generatorError.classList.remove(
            "active"
        );

    }
);


// ============================
// BACK
// ============================

generatorBack.addEventListener(
    "click",
    () => {

        if(hasData()){

            openModal(
                "Are you sure you want to go back? Doing so will lose unsaved data.",
                "home"
            );

        }
        else{

            location.replace("/");

        }

    }
);


// ==================================================
// FINISH
// ==================================================

generatorFinish.addEventListener(
    "click",
    () => {

        /*
           Final validation of every question.
        */

        if(!validateAllRows()){

            return;

        }


        enterFinishPage();

    }
);
// ============================
// POPUP NO
// ============================

generatorModalNo.addEventListener(
    "click",
    closeModal
);


// ============================
// POPUP YES
// ============================

generatorModalYes.addEventListener(
    "click",
    () => {

        const action = modalAction;

        closeModal();


        if(action === "home"){

            location.replace("/");

            return;

        }


        if(action === "finish-page-next"){

            sendQuestionPaperDataToPython()
                .then(filePackage => {

                    receiveGeneratedFiles(
                        filePackage
                    );


                    finishScreen.classList.remove(
                        "active"
                    );

                    finish2Screen.classList.add(
                        "active"
                    );

                })
                .catch(error => {

                    console.error(
                        "Failed to send data to Python:",
                        error
                    );

                });

        }

    }
);

function getFinishInputs(){

    return [
        ...document.querySelectorAll(
            ".finish-input"
        )
    ];

}

function saveFinishData(){

    getFinishInputs().forEach(input => {

        finishData[input.dataset.finishField] =
            input.value;

    });

}

function loadFinishData(){

    getFinishInputs().forEach(input => {

        input.value =
            finishData[input.dataset.finishField] || "";

        input.classList.remove("invalid");

    });

    finishError.classList.remove("active");

}


function validateFinishPage(){

    const inputs = getFinishInputs();

    let valid = true;


    // Remove old error highlighting
    inputs.forEach(input => {

        input.classList.remove("invalid");

    });


    // Check every field
    inputs.forEach(input => {

        if(input.value.trim() === ""){

            input.classList.add("invalid");

            valid = false;

        }

    });


    // Check student count
    const studentInput =
        document.querySelector(
            '[data-finish-field="studentCount"]'
        );


    const studentValue =
        studentInput.value.trim();


    if(
        !/^[1-9]\d*$/.test(studentValue)
    ){

        studentInput.classList.add("invalid");

        valid = false;

    }


    finishError.classList.toggle(
        "active",
        !valid
    );


    return valid;

}

function enterFinishPage(){

    generatorScreen.classList.remove(
        "active"
    );

    finishScreen.classList.add(
        "active"
    );

    loadFinishData();

}

function openModal(message, action){

    generatorModalMessage.textContent =
        message;

    modalAction = action;

    generatorModal.classList.add(
        "active"
    );

    generatorModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


// Close popup.
function closeModal(){

    generatorModal.classList.remove(
        "active"
    );

    generatorModal.setAttribute(
        "aria-hidden",
        "true"
    );

    modalAction = null;

}

// ============================
// FINISH PAGE 1 save
// ============================
finishSave.addEventListener(
    "click",
    () => {

        finishData.save =
            !finishData.save;

        finishSaveIndicator.style.background =
            finishData.save
                ? "#4caf50"
                : "#c94b4b";

    }
);

// ============================
// FINISH PAGE 1 BACK
// ============================

finishBack.addEventListener(
    "click",
    () => {

        finishScreen.classList.remove(
            "active"
        );

        generatorScreen.classList.add(
            "active"
        );

        document.body.classList.add(
            "generator-mode"
        );

    }
);

// ============================
// FINISH PAGE 1 NEXT
// ============================

finishNext.addEventListener(
    "click",
    () => {

        saveFinishData();

        if(!validateFinishPage()){

            return;

        }


        openModal(
            "Are you sure you want to preceed? None of the details after this point can be changed.",
            "finish-page-next"
        );

    }
);

let generatedFiles = null;

function receiveGeneratedFiles(filePackage){
    //temp debug
    console.log("FILE PACKAGE RECEIVED:", filePackage);

    generatedFiles = filePackage;

    renderGeneratedFiles(filePackage);

}

/* =========================================================
   QPG IMPORT SYSTEM
   ========================================================= */

let savedQuestionItems = [];
let importSearchResult = [];

let importDateParameters = {
    year: "",
    month: "",
    day: ""
};

let importTestSeriesParameter = "";
let importFileNameParameter = "";
let activeImportTextSearchParameter = null;

let selectedSavedQuestion = null;
let selectedSavedQuestionData = null;

let importAdditionParameters = {
    range: [],
    single: []
};

let importRangeRows = [];

const importMonths = [
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

const importDefaultValue =
    "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u";


/* =========================================================
   IMPORT ELEMENT REFERENCES
   ========================================================= */

/*
   These IDs will be added to the HTML in the next step.
*/

const importButton =
    document.getElementById("generator-import");

const importModal =
    document.getElementById("qpg-import-modal");

const importVisual =
    document.getElementById("qpg-import-visual");

const importBackButton =
    document.getElementById("qpg-import-back");

const importSearchButton =
    document.getElementById("qpg-import-search-button");


/* =========================================================
   IMPORT DATE POPUP
   ========================================================= */

const importDateButton =
    document.getElementById("qpg-import-date-button");

const importDateModal =
    document.getElementById("qpg-import-date-modal");

const importDateYearInput =
    document.getElementById("qpg-import-date-year");

const importDateYearArrow =
    document.getElementById("qpg-import-date-year-arrow");

const importDateYearDropdown =
    document.getElementById("qpg-import-date-year-dropdown");

const importDateMonthInput =
    document.getElementById("qpg-import-date-month");

const importDateMonthArrow =
    document.getElementById("qpg-import-date-month-arrow");

const importDateMonthDropdown =
    document.getElementById("qpg-import-date-month-dropdown");

const importDateDayInput =
    document.getElementById("qpg-import-date-day");

const importDateDayArrow =
    document.getElementById("qpg-import-date-day-arrow");

const importDateDayDropdown =
    document.getElementById("qpg-import-date-day-dropdown");

const importDateBackButton =
    document.getElementById("qpg-import-date-back");

const importDateOKButton =
    document.getElementById("qpg-import-date-ok");


/* =========================================================
   IMPORT TEXT SEARCH POPUP
   ========================================================= */

const importTestSeriesButton =
    document.getElementById("qpg-import-test-series-button");

const importFileNameButton =
    document.getElementById("qpg-import-file-name-button");

const importTextSearchModal =
    document.getElementById("qpg-import-text-search-modal");

const importTextSearchTitle =
    document.getElementById("qpg-import-text-search-title");

const importTextSearchInput =
    document.getElementById("qpg-import-text-search-input");

const importTextSearchBackButton =
    document.getElementById("qpg-import-text-search-back");

const importTextSearchOKButton =
    document.getElementById("qpg-import-text-search-ok");


/* =========================================================
   PREVIEW POPUP
   ========================================================= */

const importPreviewModal =
    document.getElementById("qpg-import-preview-modal");

const importPreviewVisual =
    document.getElementById("qpg-import-preview-visual");

const importPreviewSeriesName =
    document.getElementById("qpg-import-preview-series-name");

const importPreviewOK =
    document.getElementById("qpg-import-preview-ok");


/* =========================================================
   ADD POPUP
   ========================================================= */

const importAddModal =
    document.getElementById("qpg-import-add-modal");

const importAddAllButton =
    document.getElementById("qpg-import-add-all");

const importAddRangeButton =
    document.getElementById("qpg-import-add-range");

const importAddIndexButton =
    document.getElementById("qpg-import-add-index");

const importAddBackButton =
    document.getElementById("qpg-import-add-back");

const importAddFinalButton =
    document.getElementById("qpg-import-add-final");


/* =========================================================
   RANGE POPUP
   ========================================================= */

const importRangeModal =
    document.getElementById("qpg-import-range-modal");

const importRangeBody =
    document.getElementById("qpg-import-range-body");

const importRangeAddButton =
    document.getElementById("qpg-import-range-add");

const importRangeBackButton =
    document.getElementById("qpg-import-range-back");

const importRangeNextButton =
    document.getElementById("qpg-import-range-next");


/* =========================================================
   INDEX POPUP
   ========================================================= */

const importIndexModal =
    document.getElementById("qpg-import-index-modal");

const importIndexBody =
    document.getElementById("qpg-import-index-body");

const importIndexBackButton =
    document.getElementById("qpg-import-index-back");

const importIndexNextButton =
    document.getElementById("qpg-import-index-next");


/* =========================================================
   DATE DROPDOWNS
   ========================================================= */

function prepareImportDateDropdowns(){

    importDateYearDropdown.innerHTML = "";
    importDateMonthDropdown.innerHTML = "";
    importDateDayDropdown.innerHTML = "";

    const currentYear =
        new Date().getFullYear();

    /*
       Same logic as Archive:
       2026 -> current year
    */

    for(let year = 2026; year <= currentYear; year++){

        const option =
            document.createElement("div");

        option.textContent = year;

        option.dataset.value =
            String(year);

        importDateYearDropdown.appendChild(option);
    }

    importMonths.forEach(month => {

        const option =
            document.createElement("div");

        option.textContent = month;

        option.dataset.value =
            month;

        importDateMonthDropdown.appendChild(option);
    });

    for(let day = 1; day <= 31; day++){

        const option =
            document.createElement("div");

        option.textContent = day;

        option.dataset.value =
            String(day);

        importDateDayDropdown.appendChild(option);
    }
}


/* =========================================================
   DATE HELPERS
   ========================================================= */

function closeImportDateDropdowns(){

    importDateYearDropdown.classList.remove("active");
    importDateMonthDropdown.classList.remove("active");
    importDateDayDropdown.classList.remove("active");
}


function normaliseImportMonth(value){

    const trimmed =
        value.trim();

    if(trimmed === ""){
        return "";
    }

    const monthIndex =
        importMonths.findIndex(
            month =>
                month.toLowerCase() ===
                trimmed.toLowerCase()
        );

    if(monthIndex !== -1){
        return importMonths[monthIndex];
    }

    if(/^\d+$/.test(trimmed)){

        const numericMonth =
            Number(trimmed);

        if(
            numericMonth >= 1 &&
            numericMonth <= 12
        ){
            return importMonths[numericMonth - 1];
        }
    }

    return null;
}


function openImportDatePopup(){

    importDateYearInput.value =
        importDateParameters.year;

    importDateMonthInput.value =
        importDateParameters.month;

    importDateDayInput.value =
        importDateParameters.day;

    closeImportDateDropdowns();

    importDateModal.classList.add("active");
}


/* =========================================================
   TEXT SEARCH
   ========================================================= */

function getImportTextSearchParameter(){

    if(
        activeImportTextSearchParameter ===
        "test_series"
    ){
        return importTestSeriesParameter;
    }

    if(
        activeImportTextSearchParameter ===
        "file_name"
    ){
        return importFileNameParameter;
    }

    return "";
}


function setImportTextSearchParameter(value){

    if(
        activeImportTextSearchParameter ===
        "test_series"
    ){
        importTestSeriesParameter =
            value;
    }

    else if(
        activeImportTextSearchParameter ===
        "file_name"
    ){
        importFileNameParameter =
            value;
    }
}


function openImportTextSearchPopup(parameter){

    activeImportTextSearchParameter =
        parameter;

    if(parameter === "test_series"){

        importTextSearchTitle.textContent =
            "Test Series";
    }

    else if(parameter === "file_name"){

        importTextSearchTitle.textContent =
            "File Name";
    }

    importTextSearchInput.value =
        getImportTextSearchParameter();

    importTextSearchModal.classList.add("active");

    importTextSearchInput.focus();
}


/* =========================================================
   SEARCH PARAMETER BUILDER
   ========================================================= */

function buildImportSearchParameters(){

    let year =
        importDefaultValue;

    let month =
        importDefaultValue;

    let day =
        importDefaultValue;


    if(importDateParameters.year !== ""){

        year =
            importDateParameters.year;
    }


    if(importDateParameters.month !== ""){

        const monthIndex =
            importMonths.indexOf(
                importDateParameters.month
            );

        if(monthIndex !== -1){

            month =
                String(monthIndex + 1)
                    .padStart(2,"0");
        }
    }


    if(importDateParameters.day !== ""){

        day =
            String(
                Number(importDateParameters.day)
            ).padStart(2,"0");
    }


    const testSeries =
        importTestSeriesParameter === ""
            ? importDefaultValue
            : importTestSeriesParameter;


    const fileName =
        importFileNameParameter === ""
            ? importDefaultValue
            : importFileNameParameter;


    return {
        year,
        month,
        day,
        test_series: testSeries,
        file_name: fileName
    };
}


/* =========================================================
   LOAD SAVED QUESTION VIEW
   ========================================================= */

async function loadSavedQuestions(){

    const response =
        await fetch(
            "/Question-paper-generator-python-data-sending-gateway-for-saved-question-view",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                        "application/json"
                },
                body:JSON.stringify({})
            }
        );


    if(!response.ok){

        throw new Error(
            "Saved question request failed: " +
            response.status
        );
    }


    const data =
        await response.json();

    savedQuestionItems =
        data;

    importSearchResult =
        data;

    refreshImportVisual(data);
}


/* =========================================================
   IMPORT RESULT DISPLAY
   ========================================================= */

function refreshImportVisual(data){

    importVisual.innerHTML = "";

    if(!data || data.length === 0){

        const empty =
            document.createElement("div");

        empty.className =
            "qpg-import-empty";

        empty.textContent =
            "No saved questions found.";

        importVisual.appendChild(empty);

        return;
    }


    data.forEach(item => {

        /*
           item:
           [
               file_name,
               file_path,
               [
                   test_series,
                   created_date
               ]
           ]
        */

        const row =
            document.createElement("div");

        row.className =
            "qpg-import-row";


        const information =
            document.createElement("div");

        information.className =
            "qpg-import-item-information";

        const fileName =
            document.createElement("div");

        fileName.className =
            "qpg-import-item-details";

        fileName.textContent =
            "File name: " + item[0];


        const testSeries =
            document.createElement("div");

        testSeries.className =
            "qpg-import-item-name";

        testSeries.textContent =
            "Test series: " + item[2][0];


        const created =
            document.createElement("div");

        created.className =
            "qpg-import-item-details";

        created.textContent =
            "Created on: " + item[2][1].join(" ");


        information.appendChild(testSeries);
        information.appendChild(fileName);
        information.appendChild(created);


        const actions =
            document.createElement("div");

        actions.className =
            "qpg-import-item-buttons";


        const preview =
            document.createElement("button");

        preview.type =
            "button";

        preview.className =
            "qpg-import-preview-button";

        preview.textContent =
            "Preview";


        preview.addEventListener(
            "click",
            () => {

                openImportPreview(item);
            }
        );


        const add =
            document.createElement("button");

        add.type =
            "button";

        add.className =
            "qpg-import-add-button";

        add.textContent =
            "Add";


        add.addEventListener(
            "click",
            () => {

                openImportAddPopup(item);
            }
        );


        actions.appendChild(preview);
        actions.appendChild(add);

        row.appendChild(information);
        row.appendChild(actions);

        importVisual.appendChild(row);
    });
}


/* =========================================================
   SEARCH
   ========================================================= */

async function searchSavedQuestions(){

    const parameters =
        buildImportSearchParameters();


    const response =
        await fetch(
            "/QPG/search-result",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify(parameters)
            }
        );


    if(!response.ok){

        throw new Error(
            "QPG search failed: " +
            response.status
        );
    }


    const data =
        await response.json();


    importSearchResult =
        data;

    refreshImportVisual(data);
}


/* =========================================================
   IMPORT MAIN POPUP
   ========================================================= */

async function openImportPopup(){

    importModal.classList.add("active");

    try{

        await loadSavedQuestions();

    }

    catch(error){

        console.error(
            "Failed to load saved questions:",
            error
        );

        importVisual.innerHTML = "";

        const errorElement =
            document.createElement("div");

        errorElement.className =
            "qpg-import-empty";

        errorElement.textContent =
            "Failed to load saved questions.";

        importVisual.appendChild(
            errorElement
        );
    }
}

function resetImportSearch(){

    importDateParameters = {
        year: "",
        month: "",
        day: ""
    };

    importTestSeriesParameter = "";
    importFileNameParameter = "";
    activeImportTextSearchParameter = null;

    importDateYearInput.value = "";
    importDateMonthInput.value = "";
    importDateDayInput.value = "";

    importTextSearchInput.value = "";

}

function closeImportPopup(){

    resetImportSearch();

    importModal.classList.remove("active");
}


/* =========================================================
   PREVIEW
   ========================================================= */

async function openImportPreview(item){

    selectedSavedQuestion =
        item;

    const testSeriesName =
        item[2][0];

    const createdDate =
        item[2][1].join(" ");

    importPreviewSeriesName.textContent =
        "Test series: " +
        testSeriesName.replaceAll("_", " ") +
        " | Created on: " +
        createdDate

    try{

        const response =
            await fetch(
                prepareImportURLPath(item[1])
            );


        if(!response.ok){

            throw new Error(
                "Failed to load saved question JSON."
            );
        }


        const data =
            await response.json();


        selectedSavedQuestionData =
            data;


        renderImportPreview(data);

        importPreviewModal.classList.add(
            "active"
        );
    }

    catch(error){

        console.error(
            "Failed to preview saved question:",
            error
        );
    }
}


/* =========================================================
   URL PREPARATION
   ========================================================= */

function prepareImportURLPath(path){

    return path
        .split("/")
        .map(
            part =>
                encodeURIComponent(part)
        )
        .join("/");
}


/* =========================================================
   PREVIEW RENDERER
   ========================================================= */

function renderImportPreview(data){

    importPreviewVisual.innerHTML = "";


    if(!Array.isArray(data)){

        return;
    }


    data.forEach(
        (question,index) => {

            const row =
                document.createElement("div");

            row.className =
                "qpg-import-preview-row";


            const serial =
                document.createElement("div");

            serial.className =
                "qpg-import-preview-serial";

            serial.textContent =
                index + 1;


            const table =
                document.createElement("table");

            table.className =
                "qpg-import-preview-table";


            const fields = [
                ["Question","question"],
                ["Option 1","option1"],
                ["Option 2","option2"],
                ["Option 3","option3"],
                ["Option 4","option4"],
                ["Answer","answer"]
            ];


            const tbody =
                document.createElement("tbody");


            fields.forEach(
                ([label,key]) => {

                    const tr =
                        document.createElement("tr");

                    const labelCell =
                        document.createElement("td");

                    labelCell.textContent =
                        label;


                    const valueCell =
                        document.createElement("td");

                    valueCell.textContent =
                        question[key] ?? "";


                    tr.appendChild(labelCell);
                    tr.appendChild(valueCell);

                    tbody.appendChild(tr);
                }
            );


            table.appendChild(tbody);

            row.appendChild(serial);
            row.appendChild(table);

            importPreviewVisual.appendChild(row);
        }
    );
}


/* =========================================================
   ADD POPUP
   ========================================================= */

function openImportAddPopup(item){

    selectedSavedQuestion =
        item;

    selectedSavedQuestionData =
        null;

    importAdditionParameters = {
        range: [],
        single: []
    };

    importRangeRows = [];

    importAddModal.classList.add("active");
}


function closeImportAddPopup(){

    importAddModal.classList.remove("active");
}


/* =========================================================
   LOAD JSON FOR ADDITION
   ========================================================= */

async function loadSelectedSavedQuestion(){

    if(selectedSavedQuestionData){

        return selectedSavedQuestionData;
    }


    if(!selectedSavedQuestion){

        throw new Error(
            "No saved question selected."
        );
    }


    const response =
        await fetch(
            prepareImportURLPath(
                selectedSavedQuestion[1]
            )
        );


    if(!response.ok){

        throw new Error(
            "Failed to load saved question JSON."
        );
    }


    selectedSavedQuestionData =
        await response.json();


    return selectedSavedQuestionData;
}


/* =========================================================
   ADD ALL
   ========================================================= */

importAddAllButton.addEventListener(
    "click",
    async () => {

        try{

            const data =
                await loadSelectedSavedQuestion();

            /*
               Add All completely bypasses the
               saved-question addition backend.
            */

            addQuestionsToGenerator(data);
            validateAllRows();

            /*
               Close the Add popup and the main
               Import popup.
            */

            closeImportAddPopup();
            closeImportPopup();

        }

        catch(error){

            console.error(
                "Add all failed:",
                error
            );
        }
    }
);


/* =========================================================
   RANGE POPUP
   ========================================================= */

async function openImportRangePopup(){

    try{

        await loadSelectedSavedQuestion();

        importRangeRows = [];

        importRangeBody.innerHTML = "";

        addImportRangeRow();

        importRangeModal.classList.add("active");

    }

    catch(error){

        console.error(
            "Failed to open range selector:",
            error
        );
    }
}


function closeImportRangePopup(){

    importRangeModal.classList.remove("active");
}


/* =========================================================
   CREATE RANGE ROW
   ========================================================= */

function addImportRangeRow(){

    const row =
        document.createElement("div");

    row.className =
        "qpg-import-range-row";


    const start =
        document.createElement("input");

    start.type =
        "text";

    start.inputMode =
        "numeric";

    start.className =
        "qpg-import-range-input";

    start.placeholder =
        "A";


    const separator =
        document.createElement("span");

    separator.textContent =
        "-";


    const end =
        document.createElement("input");

    end.type =
        "text";

    end.inputMode =
        "numeric";

    end.className =
        "qpg-import-range-input";

    end.placeholder =
        "B";


    row.appendChild(start);
    row.appendChild(separator);
    row.appendChild(end);

    importRangeBody.appendChild(row);

    importRangeRows.push({
        row,
        start,
        end
    });


    attachImportRangeValidation(
        start,
        end
    );
}


/* =========================================================
   RANGE VALIDATION
   ========================================================= */

function attachImportRangeValidation(
    start,
    end
){

    const validate =
        (changedInput) => {

            const data =
                selectedSavedQuestionData;


            if(!data){
                return;
            }


            const maximum =
                data.length ;


            /*
               Only digits are allowed.
            */

            changedInput.value =
                changedInput.value.replace(
                    /\D/g,
                    ""
                );


            if(changedInput.value === ""){
                return;
            }


            const value =
                Number(changedInput.value);


            /*
               Correct boundary:
               1 <= value <= len(json)
            */

            if(
                value < 1 ||
                value > maximum
            ){

                changedInput.value =
                    changedInput.value.slice(
                        0,
                        -1
                    );

                return;
            }


            const startValue =
                Number(start.value);

            const endValue =
                Number(end.value);


            /*
               A must remain strictly smaller
               than B.
            */

            if(
                start.value !== "" &&
                end.value !== "" &&
                startValue >= endValue
            ){

                changedInput.value =
                    changedInput.value.slice(
                        0,
                        -1
                    );
            }
        };


    start.addEventListener(
        "input",
        () => validate(start)
    );


    end.addEventListener(
        "input",
        () => validate(end)
    );
}


/* =========================================================
   RANGE NEXT
   ========================================================= */

importRangeNextButton.addEventListener(
    "click",
    () => {

        const ranges = [];


        for(
            const rangeRow
            of importRangeRows
        ){

            const A =
                Number(
                    rangeRow.start.value
                );

            const B =
                Number(
                    rangeRow.end.value
                );


            if(
                rangeRow.start.value === "" ||
                rangeRow.end.value === ""
            ){

                return;
            }


            if(
                A < 1 ||
                B < 1 ||
                A > selectedSavedQuestionData.length  ||
                B > selectedSavedQuestionData.length  ||
                A >= B
            ){

                return;
            }


            ranges.push([A,B]);
        }


        importAdditionParameters.range =
            ranges;


        closeImportRangePopup();
    }
);


/* =========================================================
   RANGE ADD
   ========================================================= */

importRangeAddButton.addEventListener(
    "click",
    () => {

        addImportRangeRow();
    }
);


/* =========================================================
   RANGE BACK
   ========================================================= */

importRangeBackButton.addEventListener(
    "click",
    () => {

        closeImportRangePopup();
    }
);


/* =========================================================
   INDEX SELECTOR
   ========================================================= */

async function openImportIndexPopup(){

    try{

        await loadSelectedSavedQuestion();

        renderImportIndexTable();

        importIndexModal.classList.add(
            "active"
        );

    }

    catch(error){

        console.error(
            "Failed to open index selector:",
            error
        );
    }
}


function closeImportIndexPopup(){

    importIndexModal.classList.remove(
        "active"
    );
}


/* =========================================================
   INDEX TABLE
   ========================================================= */

function renderImportIndexTable(){

    importIndexBody.innerHTML = "";


    const maximum =
        selectedSavedQuestionData.length ;


    for(
        let index = 1;
        index <= maximum;
        index++
    ){

        const row =
            document.createElement("div");

        row.className =
            "qpg-import-index-row";


        const checkbox =
            document.createElement("input");

        checkbox.type =
            "checkbox";

        checkbox.value =
            String(index);

        checkbox.dataset.index =
            String(index);


        const label =
            document.createElement("span");

        label.textContent =
            String(index);


        row.appendChild(checkbox);
        row.appendChild(label);

        importIndexBody.appendChild(row);
    }
}


/* =========================================================
   INDEX NEXT
   ========================================================= */

importIndexNextButton.addEventListener(
    "click",
    () => {

        const selected =
            [
                ...importIndexBody.querySelectorAll(
                    'input[type="checkbox"]:checked'
                )
            ]
            .map(
                checkbox =>
                    Number(checkbox.value)
            );


        importAdditionParameters.single =
            selected;

        closeImportIndexPopup();
    }
);


/* =========================================================
   INDEX BACK
   ========================================================= */

importIndexBackButton.addEventListener(
    "click",
    () => {

        closeImportIndexPopup();
    }
);


/* =========================================================
   ADD RANGE / INDEX BUTTONS
   ========================================================= */

importAddRangeButton.addEventListener(
    "click",
    () => {

        openImportRangePopup();
    }
);


importAddIndexButton.addEventListener(
    "click",
    () => {

        openImportIndexPopup();
    }
);


/* =========================================================
   ADD POPUP BACK
   ========================================================= */

importAddBackButton.addEventListener(
    "click",
    () => {

        closeImportAddPopup();
    }
);


/* =========================================================
   FINAL ADD
   ========================================================= */

importAddFinalButton.addEventListener(
    "click",
    async () => {

        try{

            await sendImportAdditionRequest();

        }

        catch(error){

            console.error(
                "Import addition failed:",
                error
            );
        }
    }
);


/* =========================================================
   BACKEND ADDITION REQUEST
   ========================================================= */

async function sendImportAdditionRequest(){

    if(!selectedSavedQuestion){

        throw new Error(
            "No saved question selected."
        );
    }


    const payload = {

        path:
            selectedSavedQuestion[1],

        range:
            importAdditionParameters.range,

        single:
            importAdditionParameters.single
    };


    const response =
        await fetch(
            "/Question-paper-generator-python-data-sending-gateway-for-saved-question-search-addition",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(payload)
            }
        );


    if(!response.ok){

        throw new Error(
            "Question addition request failed: " +
            response.status
        );
    }


    const questions =
        await response.json();


    addQuestionsToGenerator(
        questions
    );

    validateAllRows();

    closeImportAddPopup();
    closeImportPopup();
}


/* =========================================================
   ADD QUESTIONS INTO CURRENT QPG TABLE
   ========================================================= */

function addQuestionsToGenerator(
    questions
){

    if(
        !Array.isArray(questions) ||
        questions.length === 0
    ){

        return;
    }


    const rows =
        getRows();


    /*
       If the generator currently consists of
       exactly one completely empty row, reuse it.
    */

    let firstRowIsEmpty =
        rows.length === 1 &&
        getRowInputs(rows[0]).every(
            input =>
                input.value === ""
        );


    questions.forEach(
        (question,index) => {

            let row;


            if(
                index === 0 &&
                firstRowIsEmpty
            ){

                row =
                    rows[0];

                firstRowIsEmpty =
                    false;
            }

            else{

                row =
                    createQuestionRow();

                generatorQuestionBody
                    .appendChild(row);
            }


            const questionData =
                getRowData(row);


            fields.forEach(
                field => {

                    const input =
                        row.querySelector(
                            `[data-field="${field}"]`
                        );


                    if(input){

                        input.value =
                            question[field] ?? "";
                    }
                }
            );
        }
    );


    updateSerialNumbers();
}


/* =========================================================
   IMPORT BUTTON
   ========================================================= */

importButton.addEventListener(
    "click",
    () => {

        openImportPopup();
    }
);


/* =========================================================
   IMPORT MAIN BACK
   ========================================================= */

importBackButton.addEventListener(
    "click",
    () => {

        closeImportPopup();
    }
);


/* =========================================================
   IMPORT SEARCH
   ========================================================= */

importSearchButton.addEventListener(
    "click",
    async () => {

        try{

            await searchSavedQuestions();

        }

        catch(error){

            console.error(
                "Import search failed:",
                error
            );
        }
    }
);


/* =========================================================
   IMPORT DATE EVENTS
   ========================================================= */

importDateButton.addEventListener(
    "click",
    openImportDatePopup
);


importDateYearArrow.addEventListener(
    "click",
    () => {

        closeImportDateDropdowns();

        importDateYearDropdown
            .classList.toggle("active");
    }
);


importDateMonthArrow.addEventListener(
    "click",
    () => {

        closeImportDateDropdowns();

        importDateMonthDropdown
            .classList.toggle("active");
    }
);


importDateDayArrow.addEventListener(
    "click",
    () => {

        closeImportDateDropdowns();

        importDateDayDropdown
            .classList.toggle("active");
    }
);


/* =========================================================
   DATE DROPDOWN SELECTION
   ========================================================= */

importDateYearDropdown.addEventListener(
    "click",
    event => {

        const option =
            event.target.closest(
                "[data-value]"
            );

        if(!option){
            return;
        }

        importDateYearInput.value =
            option.dataset.value;

        closeImportDateDropdowns();
    }
);


importDateMonthDropdown.addEventListener(
    "click",
    event => {

        const option =
            event.target.closest(
                "[data-value]"
            );

        if(!option){
            return;
        }

        importDateMonthInput.value =
            option.dataset.value;

        closeImportDateDropdowns();
    }
);


importDateDayDropdown.addEventListener(
    "click",
    event => {

        const option =
            event.target.closest(
                "[data-value]"
            );

        if(!option){
            return;
        }

        importDateDayInput.value =
            option.dataset.value;

        closeImportDateDropdowns();
    }
);


/* =========================================================
   DATE OK
   ========================================================= */

importDateOKButton.addEventListener(
    "click",
    () => {

        const year =
            importDateYearInput.value.trim();

        const month =
            normaliseImportMonth(
                importDateMonthInput.value
            );

        const day =
            importDateDayInput.value.trim();


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


        importDateParameters = {
            year,
            month,
            day
        };


        importDateModal.classList.remove(
            "active"
        );
    }
);


/* =========================================================
   DATE BACK
   ========================================================= */

importDateBackButton.addEventListener(
    "click",
    () => {

        importDateModal.classList.remove(
            "active"
        );
    }
);


/* =========================================================
   TEXT SEARCH BUTTONS
   ========================================================= */

importTestSeriesButton.addEventListener(
    "click",
    () => {

        openImportTextSearchPopup(
            "test_series"
        );
    }
);


importFileNameButton.addEventListener(
    "click",
    () => {

        openImportTextSearchPopup(
            "file_name"
        );
    }
);


/* =========================================================
   TEXT SEARCH BACK
   ========================================================= */

importTextSearchBackButton.addEventListener(
    "click",
    () => {

        importTextSearchModal
            .classList.remove("active");
    }
);


/* =========================================================
   TEXT SEARCH OK
   ========================================================= */

importTextSearchOKButton.addEventListener(
    "click",
    () => {

        setImportTextSearchParameter(
            importTextSearchInput.value.trim()
        );


        importTextSearchModal
            .classList.remove("active");
    }
);


/* =========================================================
   PREVIEW OK
   ========================================================= */

importPreviewOK.addEventListener(
    "click",
    () => {

        importPreviewModal
            .classList.remove("active");
    }
);


/* =========================================================
   INITIALISE IMPORT SYSTEM
   ========================================================= */

prepareImportDateDropdowns();

// ==================================================
// HTML -> PYTHON
// QUESTION PAPER GENERATOR DATA
// ==================================================

async function sendQuestionPaperDataToPython(){

    const generationPackage = {

        Question_paper:
            getRows().map(
                (row,index) => {

                    const questionData =
                        getRowData(row);

                    return {

                        serial:
                            index + 1,

                        ...questionData

                    };

                }
            ),


        Paper_details: structuredClone(
            finishData
        )

    };


    const response = await fetch(
        "/Question-paper-generator-python-data-sending-gateway",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(
                generationPackage
            )
        }
    );


    if(!response.ok){

        throw new Error(
            `Python gateway returned HTTP ${response.status}`
        );

    }


    const result =
        await response.json();

    console.log(
        "PYTHON QPG RESPONSE:",
        result
    );

    return result;

}

// ==================================================
// RENDER PYTHON FILE PACKAGE
// ==================================================

function renderGeneratedFiles(filePackage){

    renderFileList(
        finish2OriginalFiles,
        filePackage.original || []
    );


    renderFileList(
        finish2IndividualFiles,
        filePackage.individual || []
    );


    renderFile(
        finish2DuplexQuestions,
        filePackage.duplex?.questions
    );


    renderFile(
        finish2DuplexOmr,
        filePackage.duplex?.questionsOMR
    );


    renderFileList(
        finish2SimplexQuestions,
        [
            filePackage.simplex?.questionsFront,
            filePackage.simplex?.questionsBack
        ].filter(Boolean)
    );


    renderFileList(
        finish2SimplexOmr,
        [
            filePackage.simplex?.omrFront,
            filePackage.simplex?.omrBack
        ].filter(Boolean)
    );

}

// ==================================================
// TEMPORARY MOCK PDF
// ==================================================
// This exists ONLY so you can test Finish Page 2
// before Python is connected.

function makeMockPdf(name){

    const body =
        `ExamForge - ${name}`;


    const stream =
        `BT /F1 12 Tf 72 720 Td (${body}) Tj ET`;


    const objects = [

        "<< /Type /Catalog /Pages 2 0 R >>",

        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",

        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",

        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",

        `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`

    ];


    let pdf =
        "%PDF-1.4\n";


    const offsets = [0];


    objects.forEach(
        (object,index) => {

            offsets[index + 1] =
                pdf.length;

            pdf +=
                `${index + 1} 0 obj\n${object}\nendobj\n`;

        }
    );


    const xref =
        pdf.length;


    pdf +=
        `xref\n0 ${objects.length + 1}\n`;

    pdf +=
        "0000000000 65535 f \n";


    for(
        let i = 1;
        i <= objects.length;
        i++
    ){

        pdf +=
            `${String(offsets[i]).padStart(10,"0")} 00000 n \n`;

    }


    pdf +=
        `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;

    pdf +=
        `startxref\n${xref}\n%%EOF`;


    return URL.createObjectURL(
        new Blob(
            [pdf],
            {type:"application/pdf"}
        )
    );

}

// ==================================================
// FILE ROW
// ==================================================

function createFileRow(file){

    const row =
        document.createElement("div");

    row.className =
        "finish2-file";


    const name =
        document.createElement("div");

    name.className =
        "finish2-file-name";

    name.textContent =
        file.name;


    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "finish2-download";

    button.textContent =
        "Download";


    button.addEventListener(
        "click",
        () => {

            const link =
                document.createElement("a");

            link.href =
                file.url;

            link.download =
                file.name;

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

        }
    );


    row.appendChild(name);

    row.appendChild(button);

    return row;

}

// ==================================================
// RENDER ONE FILE
// ==================================================

function renderFile(container,file){

    container.replaceChildren();

    if(file){

        container.appendChild(
            createFileRow(file)
        );

    }

}


// ==================================================
// RENDER MULTIPLE FILES
// ==================================================

function renderFileList(container,files){

    container.replaceChildren();

    files.forEach(file => {

        container.appendChild(
            createFileRow(file)
        );

    });

}

// ============================
// INPUT HANDLING
// ============================

generatorQuestionBody.addEventListener(
    "input",
    event => {

        const input =
            event.target.closest(
                ".generator-input"
            );

        if(!input){
            return;
        }


        /*
           Answer accepts ONLY 1-4.

           Invalid characters are removed
           immediately.
        */

        if(
            input.dataset.field ===
            "answer"
        ){

            input.value =
                input.value.replace(
                    /[^1-4]/g,
                    ""
                );

        }


        /*
           Live validation is ONLY allowed
           to remove an existing error.

           It can NEVER create a new error.
        */

        if(
            !input.classList.contains(
                "invalid"
            )
        ){

            return;
        }


        /*
           ANSWER FIELD

           Remove the error ONLY when the
           answer is exactly 1, 2, 3 or 4.
        */

        if(
            input.dataset.field ===
            "answer"
        ){

            if(
                /^[1-4]$/.test(
                    input.value.trim()
                )
            ){

                input.classList.remove(
                    "invalid"
                );

            }

            return;
        }


        /*
           NORMAL FIELDS

           Remove the error only when
           this particular field becomes
           non-empty.
        */

        if(
            input.value.trim() !== ""
        ){

            input.classList.remove(
                "invalid"
            );

        }

    }
);

finish2Back.addEventListener(
    "click",
    () => {

        // Temporary generated browser files
        // are destroyed here.

        if(generatedFiles){

            const revokeFile =
                file => {

                    if(
                        file &&
                        file.url
                    ){

                        URL.revokeObjectURL(
                            file.url
                        );

                    }

                };


            (
                generatedFiles.original ||
                []
            ).forEach(
                revokeFile
            );


            (
                generatedFiles.individual ||
                []
            ).forEach(
                revokeFile
            );


            revokeFile(
                generatedFiles.duplex?.questions
            );

            revokeFile(
                generatedFiles.duplex?.questionsOMR
            );

            revokeFile(
                generatedFiles.simplex?.questionsFront
            );

            revokeFile(
                generatedFiles.simplex?.questionsBack
            );

            revokeFile(
                generatedFiles.simplex?.omrFront
            );

            revokeFile(
                generatedFiles.simplex?.omrBack
            );

        }


        generatedFiles = null;


        // Leave QPG and return to Home.
        // The QPG page unloads, destroying its in-memory data.

        location.replace("/");

    }
);

