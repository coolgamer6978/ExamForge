//NAME OF FILE IS QPG.js
const finishScreen =
    document.getElementById("finish-screen");

const finishBack =
    document.getElementById("finish-back");

const finishNext =
    document.getElementById("finish-next");

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

const generatorSerial =
    document.getElementById("generator-serial");

const generatorError =
    document.getElementById("generator-error");

const generatorBack =
    document.getElementById("generator-back");

const generatorPrevious =
    document.getElementById("generator-previous");

const generatorNext =
    document.getElementById("generator-next");

const generatorFinish =
    document.getElementById("generator-finish");

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

// Stores completed questions.

const pages = new Map();

const finishData = {
    testSeriesName: "",
    setCode: "",
    time: "",
    totalMarks: "",
    institution: "",
    studentCount: ""
};

let currentQuestion = 1;
let modalAction = null;


// Get all editable boxes.
function inputs(){
    return [...document.querySelectorAll(".generator-input")];
}


// Collect current table data.
function getData(){

    const data = {};

    inputs().forEach(input => {
        data[input.dataset.field] = input.value;
    });

    return data;
}


// Put stored data into the table.
function setData(data){

    inputs().forEach(input => {

        input.value =
            data[input.dataset.field] || "";

        input.classList.remove("invalid");
    });

    generatorSerial.textContent =
        currentQuestion;

    generatorError.classList.remove("active");

    generatorPrevious.disabled =
        currentQuestion === 1;
}

// Save current question.
function save(){

    pages.set(
        currentQuestion,
        getData()
    );
}


// Load a question.
function load(number){

    currentQuestion = number;

    setData(
        pages.get(number) || {}
    );
}


// Check whether anything has been typed.
function hasData(){

    // Check the currently visible question
    if(
        Object.values(getData())
            .some(value => value.length > 0)
    ){
        return true;
    }

    // Check every previously saved question
    for(const questionData of pages.values()){

        if(
            Object.values(questionData)
                .some(value => value.length > 0)
        ){
            return true;
        }

    }

    return false;
}

// Validate the current question.
function validate(){

    const data = getData();

    let valid = true;


    inputs().forEach(input => {
        input.classList.remove("invalid");
    });


    // Every field must contain something.
    fields.forEach(field => {

        if(data[field].trim() === ""){

            document
                .querySelector(
                    `[data-field="${field}"]`
                )
                .classList.add("invalid");

            valid = false;
        }

    });


    // Answer must be exactly 1, 2, 3 or 4.
    if(!/^[1-4]$/.test(data.answer.trim())){

        document
            .querySelector(
                '[data-field="answer"]'
            )
            .classList.add("invalid");

        valid = false;
    }


    generatorError.classList.toggle(
        "active",
        !valid
    );


    return valid;
}

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


// ============================
// PREVIOUS
// ============================

generatorPrevious.addEventListener(
    "click",
    () => {

        if(currentQuestion > 1){

            save();

            load(
                currentQuestion - 1
            );

        }

    }
);


// ============================
// NEXT
// ============================

generatorNext.addEventListener(
    "click",
    () => {

        if(!validate()){

            return;

        }


        save();

        load(
            currentQuestion + 1
        );

    }
);


// ============================
// FINISH
// ============================

generatorFinish.addEventListener(
    "click",
    () => {

        if(!validate()){

            return;

        }

        // Save the current question.
        save();

        // Go directly to Finish Page 1.
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

        load(currentQuestion);

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

    generatedFiles = filePackage;

    renderGeneratedFiles(filePackage);

}

// ==================================================
// HTML -> PYTHON
// QUESTION PAPER GENERATOR DATA
// ==================================================

async function sendQuestionPaperDataToPython(){

    const generationPackage = {

        Question_paper: [...pages.entries()].map(
            ([serial, questionData]) => ({

                serial: serial,

                ...questionData

            })
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


    return await response.json();

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
// TEMPORARY MOCK OUTPUT
// ==================================================

function createMockGeneratedFiles(){

    const prefix =
        "TestSeries_A";


    const make = name => ({

        name: name,

        url: makeMockPdf(name)

    });


    return {

        original: [

            make(
                `${prefix}_Original_Question_Paper.pdf`
            ),

            make(
                `${prefix}_OMR.pdf`
            )

        ],


        individual:

            Array.from(
                {length:15},
                (_,index) => {

                    const code =
                        String(
                            1000 + index
                        ).padStart(
                            4,
                            "0"
                        );


                    return make(
                        `${prefix}_${code}.pdf`
                    );

                }
            ),


        duplex: {

            questions:
                make(
                    `${prefix}_Duplex_Compiled_Questions.pdf`
                ),

            questionsOMR:
                make(
                    `${prefix}_Duplex_Compiled_Questions_OMR.pdf`
                )

        },


        simplex: {

            questionsFront:
        make(
            `${prefix}_Simplex_Questions_Front.pdf`
        ),

            questionsBack:
        make(
            `${prefix}_Simplex_Questions_Back.pdf`
        ),

            omrFront:
        make(
            `${prefix}_Simplex_Questions_OMR_Front.pdf`
        ),

            omrBack:
        make(
            `${prefix}_Simplex_Questions_OMR_Back.pdf`
                )

        }

    };

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

inputs().forEach(input => {

    input.addEventListener(
        "input",
        () => {

            input.classList.remove(
                "invalid"
            );

            generatorError.classList.remove(
                "active"
            );


            // Answer accepts ONLY 1-4.
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

        }
    );

});

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

