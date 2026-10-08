//region Data structure setup
/* =========================================================
   ARCHIVE MAIN STATE
   ========================================================= */

let address = "/Archive/storage";

let visual = [];

let searchMode = false;

/* =========================================================
   SEARCH PARAMETER STATE
   ========================================================= */

let dateParameters = {
    year: "",
    month: "",
    day: ""
};

let testSeriesParameter = "";
let setCodeParameter = "";
let fileNameParameter = "";

let activeTextSearchParameter = null;
//endregion
//region Constants
/* =========================================================
   MAIN HTML ELEMENTS
   ========================================================= */

const addressDisplay = document.querySelector("#archive-address");

const visualContainer = document.querySelector("#archive-visual");

const homeButton = document.querySelector("#archive-home-button");

const searchButton = document.querySelector("#archive-search-button");

const backButton = document.querySelector("#archive-back-button");

const explorerButton = document.querySelector("#archive-explorer-button");

/* =========================================================
   HOME POPUP ELEMENTS
   ========================================================= */

const homeModal = document.querySelector("#archive-home-modal");

const homeYesButton = document.querySelector("#archive-home-yes");

const homeNoButton = document.querySelector("#archive-home-no");


/* =========================================================
   DATE SEARCH ELEMENTS
   ========================================================= */

const dateButton = document.querySelector("#archive-date-button");

const dateModal = document.querySelector("#archive-date-modal");

const dateYearInput = document.querySelector("#archive-date-year");

const dateYearArrow = document.querySelector("#archive-date-year-arrow");

const dateYearDropdown = document.querySelector("#archive-date-year-dropdown");

const dateMonthInput = document.querySelector("#archive-date-month");

const dateMonthArrow = document.querySelector("#archive-date-month-arrow");

const dateMonthDropdown = document.querySelector("#archive-date-month-dropdown");

const dateDayInput = document.querySelector("#archive-date-day");

const dateDayArrow = document.querySelector("#archive-date-day-arrow");

const dateDayDropdown = document.querySelector("#archive-date-day-dropdown");

const dateBackButton = document.querySelector("#archive-date-back");

const dateOKButton = document.querySelector("#archive-date-ok");


/* =========================================================
   TEXT SEARCH PARAMETER ELEMENTS
   Reused by Test Series, Set Code and File Name.
   ========================================================= */

const testSeriesButton = document.querySelector("#archive-test-series-button");

const setCodeButton = document.querySelector("#archive-set-code-button");

const fileNameButton = document.querySelector("#archive-file-name-button");

const textSearchModal = document.querySelector("#archive-text-search-modal");

const textSearchTitle = document.querySelector("#archive-text-search-title");

const textSearchInput = document.querySelector("#archive-text-search-input");

const textSearchBackButton = document.querySelector("#archive-text-search-back");

const textSearchOKButton = document.querySelector("#archive-text-search-ok");

/* =========================================================
   DATE DROPDOWN DATA
   ========================================================= */

const currentYear =
    new Date().getFullYear();


const months = [
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
// Empty string value

const defaultValue = "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u";
//endregion
//region Functions
/* =========================================================
   REQUEST PATH HANDLER
   Converts:

   /Archive/storage/My Folder/Test #1.pdf

   into a safely usable URL path while keeping "/" separators.
   ========================================================= */

function prepareURLPath(path){

    return path
        .split("/")
        .map(part => encodeURIComponent(part))
        .join("/");
}


/* =========================================================
   ADDRESS DISPLAY
   ========================================================= */

function refreshAddressDisplay(){

    if(addressDisplay){
        addressDisplay.textContent = address;
    }
}


/* =========================================================
   BACK BUTTON STATE
   ========================================================= */

function refreshBackButton(){

    backButton.disabled =
        searchMode ||
        address === "/Archive/storage";

}


/* =========================================================
   DOWNLOAD HANDLER
   The page itself does NOT navigate.
   ========================================================= */

function startDownload(path, type){

    const temporaryAddress =
        address + "/" + path;

    const encodedAddress =
        prepareURLPath(temporaryAddress);

    let downloadURL;

    if(type === "dir"){

        downloadURL =
            "/Dowload-dir" + encodedAddress;

    }
    else if(type === "file"){

        downloadURL =
            "/Dowload" + encodedAddress;

    }
    else{

        console.error(
            "Unknown archive item type:",
            type
        );

        return;
    }


    /*
        Use an iframe so the current Archive page
        does not change.
    */

    const downloadFrame =
        document.createElement("iframe");

    downloadFrame.style.display = "none";

    downloadFrame.src = downloadURL;

    document.body.appendChild(downloadFrame);


    /*
        Remove the iframe later.
    */

    setTimeout(() => {

        downloadFrame.remove();

    }, 60000);
}


/* =========================================================
   RENDER ARCHIVE DATA
   Receives:

   [
       ["name","dir"],
       ["name","file"]
   ]

   and puts it into visual.
   ========================================================= */

function refreshVisual(data){

    visual =
        Array.isArray(data)
            ? data
            : [];

    visualContainer.innerHTML = "";

    if(visual.length === 0){

        const emptyMessage =
            document.createElement("div");

        emptyMessage.className =
            "archive-empty-message";

        emptyMessage.textContent =
            "No Files Found";

        visualContainer.appendChild(
            emptyMessage
        );

        return;
    }

    for(const item of visual){

        if(!Array.isArray(item)){
            continue;
        }

        const name = item[0];
        const type = item[1];


        if(type !== "dir" && type !== "file"){
            console.error(
                "Illegal archive item type:",
                type
            );

            continue;
        }


        /* =============================================
           ROW
           ============================================= */

        const row =
            document.createElement("div");

        row.className =
            "archive-row";

        row.dataset.name =
            name;

        row.dataset.type =
            type;


        /* =============================================
           NAME
           ============================================= */

        const nameElement =
            document.createElement("div");

        nameElement.className =
            "archive-item-name";

        nameElement.textContent =
            name;


        row.appendChild(nameElement);


        /* =============================================
           BUTTON AREA
           ============================================= */

        const buttonArea =
            document.createElement("div");

        buttonArea.className =
            "archive-item-buttons";


        /* =============================================
           DIRECTORY
           → OPEN + DOWNLOAD
           ============================================= */

        if(type === "dir"){

            const openButton =
                document.createElement("button");

            openButton.type =
                "button";

            openButton.className =
                "archive-open-button";

            openButton.textContent =
                "Open";


            const downloadButton =
                document.createElement("button");

            downloadButton.type =
                "button";

            downloadButton.className =
                "archive-download-button";

            downloadButton.textContent =
                "Download";


            /*
                Give both buttons access to BOTH
                name and type.
            */

            openButton.dataset.name =
                name;

            openButton.dataset.type =
                type;

            downloadButton.dataset.name =
                name;

            downloadButton.dataset.type =
                type;


            openButton.addEventListener(
                "click",
                () => {

                    const itemName =
                        openButton.dataset.name;

                    const itemType =
                        openButton.dataset.type;


                    if(itemType !== "dir"){
                        return;
                    }


                    openArchiveDirectory(
                        itemName
                    );
                }
            );


            downloadButton.addEventListener(
                "click",
                () => {

                    const itemName =
                        downloadButton.dataset.name;

                    const itemType =
                        downloadButton.dataset.type;


                    startDownload(
                        itemName,
                        itemType
                    );
                }
            );


            buttonArea.appendChild(
                openButton
            );

            buttonArea.appendChild(
                downloadButton
            );
        }


        /* =============================================
           FILE
           → DOWNLOAD ONLY
           ============================================= */

        else if(type === "file"){

            const downloadButton =
                document.createElement("button");

            downloadButton.type =
                "button";

            downloadButton.className =
                "archive-download-button";

            downloadButton.textContent =
                "Download";


            downloadButton.dataset.name =
                name;

            downloadButton.dataset.type =
                type;


            downloadButton.addEventListener(
                "click",
                () => {

                    const itemName =
                        item[2] === "Search"
                            ? item[3]
                            : downloadButton.dataset.name;

                    const itemType =
                        downloadButton.dataset.type;


                    startDownload(
                        itemName,
                        itemType
                    );
                }
            );


            buttonArea.appendChild(
                downloadButton
            );
        }


        row.appendChild(
            buttonArea
        );


        visualContainer.appendChild(
            row
        );
    }
}


/* =========================================================
   LOAD DIRECTORY
   ========================================================= */

async function loadArchiveDirectory(
    targetAddress,
    updateAddress
){

    const requestURL =
        prepareURLPath(targetAddress);


    try{

        const response =
            await fetch(
                requestURL,
                {
                    method: "GET"
                }
            );


        if(!response.ok){

            throw new Error(
                "Archive request failed: " +
                response.status
            );
        }


        const data =
            await response.json();


        /*
            Only change address after the
            requested directory successfully responds.
        */

        if(updateAddress){

            address =
                targetAddress;

            refreshAddressDisplay();

            refreshBackButton();
        }


        refreshVisual(data);
    }

    catch(error){

        console.error(
            "Archive navigation error:",
            error
        );
    }
}


/* =========================================================
   OPEN DIRECTORY
   ========================================================= */

async function openArchiveDirectory(
    itemName
){

    const newAddress =
        address + "/" + itemName;


    await loadArchiveDirectory(
        newAddress,
        true
    );
}


/* =========================================================
   BACK
   ========================================================= */

async function goBack(){

    if(
        searchMode ||
        address === "/Archive/storage"
    ){
        return;
    }

    const addressParts =
        address.split("/");


    addressParts.pop();


    const newAddress =
        addressParts.join("/");


    await loadArchiveDirectory(
        newAddress,
        true
    );
}


/* =========================================================
   HOME POPUP
   ========================================================= */

function openHomePopup(){

    homeModal.classList.add(
        "active"
    );
}


function closeHomePopup(){

    homeModal.classList.remove(
        "active"
    );
}

/* =========================================================
   CREATE DATE DROPDOWN OPTIONS
   ========================================================= */

function createDropdownOption(
    text,
    value,
    dropdown,
    input
){

    const option =
        document.createElement("button");

    option.type =
        "button";

    option.textContent =
        text;

    option.dataset.value =
        value;


    option.addEventListener(
        "click",
        () => {

            input.value =
                value;

            dropdown.hidden =
                true;
        }
    );


    dropdown.appendChild(
        option
    );
}


function prepareDateDropdowns(){

    /* YEAR */

    dateYearDropdown.innerHTML = "";

    for(
        let year = 2026;
        year <= currentYear;
        year++
    ){

        createDropdownOption(
            String(year),
            String(year),
            dateYearDropdown,
            dateYearInput
        );
    }


    /* MONTH */

    dateMonthDropdown.innerHTML = "";

    for(
        let index = 0;
        index < months.length;
        index++
    ){

        createDropdownOption(
            months[index],
            months[index],
            dateMonthDropdown,
            dateMonthInput
        );
    }


    /* DAY */

    dateDayDropdown.innerHTML = "";

    for(
        let day = 1;
        day <= 31;
        day++
    ){

        createDropdownOption(
            String(day),
            String(day),
            dateDayDropdown,
            dateDayInput
        );
    }
}


/* =========================================================
   DATE DROPDOWN OPEN/CLOSE
   ========================================================= */

function closeDateDropdowns(){

    dateYearDropdown.hidden =
        true;

    dateMonthDropdown.hidden =
        true;

    dateDayDropdown.hidden =
        true;
}

/* =========================================================
   MONTH VALIDATION / NORMALISATION
   ========================================================= */

function normaliseMonth(value){

    const trimmed =
        value.trim();


    if(trimmed === ""){
        return "";
    }


    /*
        Allow typing the month name.
    */

    const monthIndex =
        months.findIndex(
            month =>
                month.toLowerCase() ===
                trimmed.toLowerCase()
        );


    if(monthIndex !== -1){

        return months[monthIndex];
    }


    /*
        Also allow numeric month typing.
        Example:
        1 → January
        12 → December
    */

    if(/^\d+$/.test(trimmed)){

        const numericMonth =
            Number(trimmed);

        if(
            numericMonth >= 1 &&
            numericMonth <= 12
        ){

            return months[numericMonth - 1];
        }
    }


    return null;
}


/* =========================================================
   DATE POPUP OPEN
   ========================================================= */

function openDatePopup(){

    dateYearInput.value =
        dateParameters.year;

    dateMonthInput.value =
        dateParameters.month;

    dateDayInput.value =
        dateParameters.day;


    closeDateDropdowns();


    dateModal.classList.add(
        "active"
    );
}

/* =========================================================
   TEXT SEARCH POPUP
   ========================================================= */

function getTextSearchParameter(){

    if(
        activeTextSearchParameter ===
        "test_series"
    ){

        return testSeriesParameter;
    }


    if(
        activeTextSearchParameter ===
        "set_code"
    ){

        return setCodeParameter;
    }


    if(
        activeTextSearchParameter ===
        "file_name"
    ){

        return fileNameParameter;
    }


    return "";
}


function setTextSearchParameter(
    value
){

    if(
        activeTextSearchParameter ===
        "test_series"
    ){

        testSeriesParameter =
            value;
    }


    else if(
        activeTextSearchParameter ===
        "set_code"
    ){

        setCodeParameter =
            value;
    }


    else if(
        activeTextSearchParameter ===
        "file_name"
    ){

        fileNameParameter =
            value;
    }
}


function openTextSearchPopup(
    parameter
){

    activeTextSearchParameter =
        parameter;


    if(parameter === "test_series"){

        textSearchTitle.textContent =
            "Test Series";
    }


    else if(parameter === "set_code"){

        textSearchTitle.textContent =
            "Set Code";
    }


    else if(parameter === "file_name"){

        textSearchTitle.textContent =
            "File Name";
    }


    textSearchInput.value =
        getTextSearchParameter();


    textSearchModal.classList.add(
        "active"
    );


    textSearchInput.focus();
}

/* =========================================================
   BUILD SEARCH CONTRACT
   ========================================================= */

function buildSearchParameters(){

    let year =
        defaultValue;

    let month =
        defaultValue;

    let day =
        defaultValue;


    /* YEAR */

    if(
        dateParameters.year !== ""
    ){

        year =
            dateParameters.year;
    }


    /* MONTH */

    if(
        dateParameters.month !== ""
    ){

        const monthIndex =
            months.indexOf(
                dateParameters.month
            );


        if(monthIndex !== -1){

            month =
                String(monthIndex + 1)
                    .padStart(2, "0");
        }
    }


    /* DAY */

    if(
        dateParameters.day !== ""
    ){

        day =
            String(
                Number(dateParameters.day)
            ).padStart(2, "0");
    }


    /* TEST SERIES */

    const testSeries =
        testSeriesParameter === ""
            ? defaultValue
            : testSeriesParameter;


    /* SET CODE */

    const setCode =
        setCodeParameter === ""
            ? defaultValue
            : setCodeParameter;


    /* FILE NAME */

    const fileName =
        fileNameParameter === ""
            ? defaultValue
            : fileNameParameter;


    return {
        year: year,
        month: month,
        day: day,
        test_series: testSeries,
        set_code: setCode,
        file_name: fileName
    };
}


/* =========================================================
   SEARCH
   THIS DOES NOT CHANGE address.
   ========================================================= */

async function searchArchive(){

    const parameters =
        buildSearchParameters();


    try{

        const response =
            await fetch(
                "/Archive/search-result",
                {
                    method: "POST",
                    headers: {
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
                "Archive search failed: " +
                response.status
            );
        }


        const data =
            await response.json();


        /*
            Search only refreshes visual.
            address remains untouched.
        */

        refreshVisual(data);

        searchMode = true;

        explorerButton.disabled = false;

        refreshBackButton();
    }

    catch(error){

        console.error(
            "Archive search error:",
            error
        );
    }
}
//endregion
//region EventListeners
/* =========================================================
   ALL EventListener
   ========================================================= */
homeButton.addEventListener(
    "click",
    () => {

        openHomePopup();
    }
);


homeNoButton.addEventListener(
    "click",
    () => {

        closeHomePopup();
    }
);


homeYesButton.addEventListener(
    "click",
    () => {

        location.replace("/");
    }
);


dateYearArrow.addEventListener(
    "click",
    () => {

        const shouldOpen =
            dateYearDropdown.hidden;

        closeDateDropdowns();

        dateYearDropdown.hidden =
            !shouldOpen;
    }
);


dateMonthArrow.addEventListener(
    "click",
    () => {

        const shouldOpen =
            dateMonthDropdown.hidden;

        closeDateDropdowns();

        dateMonthDropdown.hidden =
            !shouldOpen;
    }
);


dateDayArrow.addEventListener(
    "click",
    () => {

        const shouldOpen =
            dateDayDropdown.hidden;

        closeDateDropdowns();

        dateDayDropdown.hidden =
            !shouldOpen;
    }
);

/* =========================================================
   DATE POPUP BACK
   Does NOT save anything.
   ========================================================= */

dateBackButton.addEventListener(
    "click",
    () => {

        closeDateDropdowns();

        dateModal.classList.remove(
            "active"
        );
    }
);


/* =========================================================
   DATE POPUP OK
   Saves the new parameter values.
   ========================================================= */

dateOKButton.addEventListener(
    "click",
    () => {

        const year =
            dateYearInput.value.trim();

        const month =
            dateMonthInput.value.trim();

        const day =
            dateDayInput.value.trim();


        /* YEAR */

        if(year !== ""){

            if(
                !/^\d{4}$/.test(year) ||
                Number(year) < 2026 ||
                Number(year) > currentYear
            ){

                alert(
                    "Please enter a valid year."
                );

                return;
            }
        }


        /* MONTH */

        const normalisedMonth =
            normaliseMonth(month);


        if(month !== "" && normalisedMonth === null){

            alert(
                "Please enter a valid month."
            );

            return;
        }


        /* DAY */

        if(day !== ""){

            if(
                !/^\d+$/.test(day) ||
                Number(day) < 1 ||
                Number(day) > 31
            ){

                alert(
                    "Please enter a valid day."
                );

                return;
            }
        }


        /*
            Only HERE do the values get saved.
        */

        dateParameters.year =
            year;

        dateParameters.month =
            normalisedMonth || "";

        dateParameters.day =
            day === ""
                ? ""
                : String(Number(day));


        closeDateDropdowns();

        dateModal.classList.remove(
            "active"
        );
    }
);


dateButton.addEventListener(
    "click",
    () => {

        openDatePopup();
    }
);


/* =========================================================
   TEXT SEARCH BACK
   Does NOT save.
   ========================================================= */

textSearchBackButton.addEventListener(
    "click",
    () => {

        activeTextSearchParameter =
            null;

        textSearchModal.classList.remove(
            "active"
        );
    }
);


/* =========================================================
   TEXT SEARCH OK
   ========================================================= */

textSearchOKButton.addEventListener(
    "click",
    () => {

        const value =
            textSearchInput.value.trim();


        setTextSearchParameter(
            value
        );


        activeTextSearchParameter =
            null;


        textSearchModal.classList.remove(
            "active"
        );
    }
);


/* =========================================================
   OPEN EACH TEXT SEARCH PARAMETER
   ========================================================= */

testSeriesButton.addEventListener(
    "click",
    () => {

        openTextSearchPopup(
            "test_series"
        );
    }
);


setCodeButton.addEventListener(
    "click",
    () => {

        openTextSearchPopup(
            "set_code"
        );
    }
);


fileNameButton.addEventListener(
    "click",
    () => {

        openTextSearchPopup(
            "file_name"
        );
    }
);


searchButton.addEventListener(
    "click",
    () => {

        searchArchive();
    }
);


/* =========================================================
   BACK BUTTON
   ========================================================= */

backButton.addEventListener(
    "click",
    () => {

        goBack();
    }
);
/* =========================================================
   EXPLORER BUTTON
   Leaves SEARCH mode and returns to
   the current directory.
   ========================================================= */

explorerButton.addEventListener(
    "click",
    async () => {

        searchMode = false;

        explorerButton.disabled = true;

        refreshBackButton();

        await loadArchiveDirectory(
            address,
            false
        );
    }
);
//endregion
/* =========================================================
   INITIAL LOAD
   FIRST JOB:
   PING /Archive/storage
   ========================================================= */

prepareDateDropdowns();

refreshAddressDisplay();

refreshBackButton();

loadArchiveDirectory(
    "/Archive/storage",
    false
);

