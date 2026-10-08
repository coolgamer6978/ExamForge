// ============================
// PAGE 1 ELEMENTS
// ============================

const answerKeyNameInput =
    document.querySelector("#answer-key-name");

const numberOfQuestionsInput =
    document.querySelector("#number-of-questions");

const page1Error =
    document.querySelector("#aku-page-1-error");

const page1BackButton =
    document.querySelector("#aku-page-1-back-button");

const page1NextButton =
    document.querySelector("#aku-page-1-next-button");

const page1 =
    document.querySelector("#aku-page-1");

const page2 =
    document.querySelector("#aku-page-2");


// ============================
// PAGE 2 ELEMENTS
// ============================

const answerKeyGrid = document.querySelector("#aku-answer-sheet-grid");

const page2Error = document.querySelector("#aku-page-2-error");

const existingNameWarning = document.querySelector("#aku-existing-name-warning");

const page2BackButton = document.querySelector("#aku-page-2-back-button");

const page2FinishButton = document.querySelector("#aku-page-2-finish-button");


// ============================
// CONFIRMATION MODAL
// ============================

const confirmationModal =
    document.querySelector("#aku-confirmation-modal");

const confirmationMessage =
    document.querySelector("#aku-confirmation-message");

const confirmationYesButton =
    document.querySelector("#aku-confirmation-yes");

const confirmationNoButton =
    document.querySelector("#aku-confirmation-no");


// ============================
// RESULT MODAL
// ============================

const resultModal =
    document.querySelector("#aku-result-modal");

const resultMessage =
    document.querySelector("#aku-result-message");

const resultOKButton =
    document.querySelector("#aku-result-ok");


// ============================
// INTERNAL STATE
// ============================

let numberOfQuestions = null;

let answerInputs = [];

let builtQuestionCount = null;

let answerKeyNameAlreadyExists = false;

let finishLocked = false;

let confirmationAction = null;

let resultAction = null;


// ============================
// PAGE 1 BACK
// ============================

page1BackButton.addEventListener(
    "click",
    () => {

        openConfirmation(
            "Current data will be lost after this action. Are you sure?",
            () => {

                clearAllAKUData();

                location.replace("/");

            }
        );

    }
);


// ============================
// NUMBER INPUT
// ============================

numberOfQuestionsInput.addEventListener(
    "input",
    () => {

        numberOfQuestionsInput.value =
            numberOfQuestionsInput.value
                .replace(/\D/g, "");

    }
);


// ============================
// PAGE 1 NEXT
// ============================

// ============================
// VERIFY ANSWER KEY NAME
// ============================

async function verifyAnswerKeyName(name){

    try{

        const response =
            await fetch(
                "/Answer-key_uploader-verify-python-data-sending-gateway",
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify(
                            [name]
                        )

                }
            );


        const responseText =
            await response.text();


        if(
            response.ok &&
            responseText.trim() === "YES"
        ){

            return true;

        }


        return false;

    }
    catch(error){

        console.error(error);

        return false;

    }

}

page1NextButton.addEventListener(
    "click",
    async () => {

        answerKeyNameInput.classList.remove(
            "invalid"
        );

        numberOfQuestionsInput.classList.remove(
            "invalid"
        );

        page1Error.textContent = "";

        page1Error.classList.remove(
            "active"
        );


        const answerKeyName =
            answerKeyNameInput.value.trim();

        const numberOfQuestionsValue =
            numberOfQuestionsInput.value.trim();


        // ============================
        // EMPTY FIELD CHECK
        // ============================

        if(
            answerKeyName === "" &&
            numberOfQuestionsValue === ""
        ){

            answerKeyNameInput.classList.add(
                "invalid"
            );

            numberOfQuestionsInput.classList.add(
                "invalid"
            );

            page1Error.textContent =
                "Name of Answer Key and Number of Questions cannot be empty.";

            page1Error.classList.add(
                "active"
            );

            return;

        }


        if(answerKeyName === ""){

            answerKeyNameInput.classList.add(
                "invalid"
            );

            page1Error.textContent =
                "Name of Answer Key cannot be empty.";

            page1Error.classList.add(
                "active"
            );

            return;

        }


        if(numberOfQuestionsValue === ""){

            numberOfQuestionsInput.classList.add(
                "invalid"
            );

            page1Error.textContent =
                "Number of Questions cannot be empty.";

            page1Error.classList.add(
                "active"
            );

            return;

        }


        numberOfQuestions =
        Number(numberOfQuestionsValue);


    // ============================
    // VERIFY ANSWER KEY NAME
    // ============================

    answerKeyNameAlreadyExists =
        await verifyAnswerKeyName(
            answerKeyName
        );


    // ============================
    // PREPARE PAGE 2
    // ============================

    preparePage2();


    if(answerKeyNameAlreadyExists){

        existingNameWarning.classList.add(
            "active"
        );

    }
    else{

        existingNameWarning.classList.remove(
            "active"
        );

    }


    page1.style.display =
        "none";

    page2.style.display =
        "block";

    }
);


// ============================
// BUILD ANSWER KEY GRID
// ============================

function ensureAnswerKeyGrid(){

    if(
        builtQuestionCount ===
        numberOfQuestions
    ){

        return;

    }


    answerKeyGrid.innerHTML =
        "";

    answerInputs = [];


    for(
        let rowStart = 1;
        rowStart <= numberOfQuestions;
        rowStart += 10
    ){

        const row =
            document.createElement("div");

        row.className =
            "aku-answer-row";


        for(
            let questionNumber = rowStart;
            questionNumber <
                rowStart + 10 &&
            questionNumber <=
                numberOfQuestions;
            questionNumber++
        ){

            const cell =
                document.createElement("div");

            cell.className =
                "aku-answer-cell";


            const number =
                document.createElement("span");

            number.className =
                "aku-question-number";

            number.textContent =
                questionNumber;


            const input =
                document.createElement("input");

            input.className =
                "aku-answer-input";

            input.type =
                "text";

            input.inputMode =
                "numeric";

            input.maxLength =
                1;

            input.autocomplete =
                "off";

            input.dataset.question =
                questionNumber;


            // ============================
            // BACKSPACE
            // ============================

            input.addEventListener(
                "keydown",
                (event) => {

                    if(
                        event.key !==
                        "Backspace"
                    ){

                        return;

                    }


                    if(
                        input.value === ""
                    ){

                        return;

                    }


                    event.preventDefault();


                    input.value =
                        "";


                    const currentIndex =
                        answerInputs.indexOf(
                            input
                        );


                    const previousInput =
                        answerInputs[
                            currentIndex - 1
                        ];


                    if(
                        previousInput &&
                        previousInput.value !== ""
                    ){

                        previousInput.focus();

                    }

                }
            );


            // ============================
            // INPUT
            // ============================

            input.addEventListener(
                "input",
                () => {

                    input.value =
                        input.value
                            .replace(
                                /[^1-4]/g,
                                ""
                            )
                            .slice(0,1);


                    if(
                        input.value === ""
                    ){

                        return;

                    }


                    const currentIndex =
                        answerInputs.indexOf(
                            input
                        );


                    const nextInput =
                        answerInputs[
                            currentIndex + 1
                        ];


                    if(
                        nextInput &&
                        nextInput.value === ""
                    ){

                        nextInput.focus();

                    }

                }
            );


            cell.appendChild(
                number
            );

            cell.appendChild(
                input
            );

            row.appendChild(
                cell
            );

            answerInputs.push(
                input
            );

        }


        answerKeyGrid.appendChild(
            row
        );

    }


    builtQuestionCount =
        numberOfQuestions;

}



// ============================
// PREPARE PAGE 2
// ============================

function preparePage2(){

    ensureAnswerKeyGrid();


    page2Error.textContent =
        "";

    page2Error.classList.remove(
        "active"
    );

    existingNameWarning.classList.remove(
        "active"
    );


    finishLocked =
        false;

    setPage2EditingEnabled(
        true
    );

}


// ============================
// ENABLE / DISABLE PAGE 2
// ============================

function setPage2EditingEnabled(
    enabled
){

    answerInputs.forEach(
        input => {

            input.disabled =
                !enabled;

        }
    );


    page2BackButton.disabled =
        !enabled;

    page2FinishButton.disabled =
        !enabled;

}


// ============================
// PAGE 2 BACK
// ============================

page2BackButton.addEventListener(
    "click",
    () => {

        page2.style.display =
            "none";

        page1.style.display =
            "block";

    }
);


// ============================
// BUILD DATA CONTRACT
// ============================

function buildAnswerKeyData(){

    const answerKey = [];


    for(
        const input of answerInputs
    ){

        if(input.value === ""){

            answerKey.push([
                Number(
                    input.dataset.question
                ),
                ""
            ]);

        }
        else{

            answerKey.push([
                Number(
                    input.dataset.question
                ),
                Number(
                    input.value
                )
            ]);

        }

    }


    return [

        answerKeyNameInput.value.trim(),

        {

            set_code:
                "Custom",

            Answer_key:
                answerKey

        }

    ];

}


// ============================
// PAGE 2 FINISH
// ============================

page2FinishButton.addEventListener(
    "click",
    () => {

        if(finishLocked){

            return;

        }


        // ============================
        // CHECK FOR EMPTY ANSWERS
        // ============================

        let hasEmptyAnswer = false;


        answerInputs.forEach(
            input => {

                input.classList.remove(
                    "invalid"
                );


                if(input.value === ""){

                    input.classList.add(
                        "invalid"
                    );

                    hasEmptyAnswer = true;

                }

            }
        );


        if(hasEmptyAnswer){

            page2Error.textContent =
                "No answer can be empty.";

            page2Error.classList.add(
                "active"
            );

            return;

        }


        // ============================
        // FINISH CONFIRMATION
        // ============================

        page2Error.textContent =
            "";

        page2Error.classList.remove(
            "active"
        );

        existingNameWarning.classList.remove(
            "active"
        );


        answerKeyNameAlreadyExists =
            false;


        openConfirmation(
            "No Data can be changed after this action. Are you sure?",
            finishAnswerKey
        );

    }
);


// ============================
// SEND ANSWER KEY
// ============================

async function finishAnswerKey(){

    finishLocked =
        true;

    setPage2EditingEnabled(
        false
    );


    page2Error.textContent =
        "";

    page2Error.classList.remove(
        "active"
    );


    const answerKeyData =
        buildAnswerKeyData();


    try{

        const response =
            await fetch(
                "/Answer-Key-Uploader-python-data-sending-gateway",
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify(
                            answerKeyData
                        )

                }
            );


        const responseText =
            await response.text();


        if(
            response.ok &&
            responseText.trim() === "YES"
        ){

            openResultModal(
                "Answer key was successfully created.",
                clearAfterSuccessfulUpload
            );

            return;

        }


        openResultModal(
            "Answer key was not created.",
            () => {

                finishLocked =
                    false;

                setPage2EditingEnabled(
                    true
                );

            }
        );

    }
    catch(error){

        console.error(error);


        openResultModal(
            "Answer key was not created.",
            () => {

                finishLocked =
                    false;

                setPage2EditingEnabled(
                    true
                );

            }
        );

    }

}


// ============================
// CLEAR AFTER SUCCESS
// ============================

function clearAfterSuccessfulUpload(){

    clearAllAKUData();

    location.replace("/");

}


// ============================
// CLEAR ALL AKU DATA
// ============================

function clearAllAKUData(){

    answerKeyNameInput.value =
        "";

    numberOfQuestionsInput.value =
        "";


    answerKeyNameInput.classList.remove(
        "invalid"
    );

    numberOfQuestionsInput.classList.remove(
        "invalid"
    );


    page1Error.textContent =
        "";

    page1Error.classList.remove(
        "active"
    );


    page2Error.textContent =
        "";

    page2Error.classList.remove(
        "active"
    );


    for(
        const input of answerInputs
    ){

        input.value =
            "";

    }


    answerInputs =
        [];


    answerKeyGrid.innerHTML =
        "";


    numberOfQuestions =
        null;


    builtQuestionCount =
        null;


    finishLocked =
        false;


    confirmationModal.style.display =
        "none";

    confirmationAction =
        null;


    resultModal.style.display =
        "none";

    resultAction =
        null;


    page2.style.display =
        "none";

    page1.style.display =
        "block";

}


// ============================
// CONFIRMATION
// ============================

function openConfirmation(
    message,
    action
){

    confirmationMessage.textContent =
        message;


    confirmationAction =
        action;


    confirmationModal.style.display =
        "flex";

}


function closeConfirmation(){

    confirmationModal.style.display =
        "none";


    confirmationAction =
        null;

}


confirmationNoButton.addEventListener(
    "click",
    () => {

        closeConfirmation();

    }
);


confirmationYesButton.addEventListener(
    "click",
    async () => {

        const action =
            confirmationAction;


        closeConfirmation();


        if(action){

            await action();

        }

    }
);


// ============================
// RESULT MODAL
// ============================

function openResultModal(
    message,
    action
){

    resultMessage.textContent =
        message;


    resultAction =
        action;


    resultModal.style.display =
        "flex";

}


function closeResultModal(){

    resultModal.style.display =
        "none";


    resultAction =
        null;

}


resultOKButton.addEventListener(
    "click",
    async () => {

        const action =
            resultAction;


        closeResultModal();


        if(action){

            await action();

        }

    }
);