// ==================================================
// EXAMFORGE UNIVERSAL SERVER HEARTBEAT
// ==================================================
//
// This file is loaded by every ExamForge HTML page.
//
// Responsibilities:
// 1. Check whether the Flask server is alive.
// 2. Show a full-screen offline overlay if validation fails.
// 3. Hide the overlay automatically when the server returns.
// 4. NEVER modify or reset application data/UI.
// 5. Keep the currently loaded page alive during an outage.
// ==================================================


// ============================
// CONFIGURATION
// ============================

const VALIDATION_URL = "/validation";

const HEARTBEAT_INTERVAL = 500;

const VALIDATION_TIMEOUT = 400;


// ============================
// OFFLINE OVERLAY
// ============================

const offlineOverlay =
    document.createElement("div");

offlineOverlay.id =
    "examforge-server-offline-overlay";


offlineOverlay.innerHTML = `

    <div class="examforge-offline-content">

        <img
            class="examforge-offline-logo"
            src="/static/Group%208.svg"
            alt="ExamForge logo">

        <h1>
            ExamForge
        </h1>

        <h2>
            Server Unavailable
        </h2>

        <p>
            The ExamForge server is currently unavailable.
        </p>

        <p>
            Waiting for server...
        </p>

    </div>

`;


// ============================
// OFFLINE OVERLAY CSS
// ============================

const offlineStyle =
    document.createElement("style");

offlineStyle.textContent = `

    #examforge-server-offline-overlay{

        position:fixed;

        inset:0;

        z-index:2147483647;

        display:none;

        align-items:center;

        justify-content:center;

        width:100vw;

        height:100vh;

        background:#111214;

        color:#f2f2f2;

        font-family:
            Arial,
            Helvetica,
            sans-serif;

        text-align:center;

        pointer-events:auto;

        user-select:none;

    }


    #examforge-server-offline-overlay.active{

        display:flex;

    }


    .examforge-offline-content{

        width:min(
            760px,
            calc(100% - 40px)
        );

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

    }


    .examforge-offline-logo{

        width:120px;

        height:120px;

        display:block;

        margin-bottom:24px;

    }


    .examforge-offline-content h1{

        margin:0 0 24px;

        color:#f2f2f2;

        font-size:40px;

        font-weight:600;

        letter-spacing:.5px;

    }


    .examforge-offline-content h2{

        margin:0 0 18px;

        color:#f2f2f2;

        font-size:28px;

        font-weight:600;

    }


    .examforge-offline-content p{

        margin:0 0 10px;

        color:#a7abb2;

        font-size:20px;

        line-height:1.5;

    }


    @media(max-width:700px){

        .examforge-offline-logo{

            width:95px;

            height:95px;

        }


        .examforge-offline-content h1{

            font-size:32px;

        }


        .examforge-offline-content h2{

            font-size:24px;

        }


        .examforge-offline-content p{

            font-size:17px;

        }

    }

`;


// Add the overlay and its CSS to the page.

document.head.appendChild(
    offlineStyle
);

document.body.appendChild(
    offlineOverlay
);


// ============================
// STATE
// ============================

let serverIsOffline = false;


// Prevent overlapping heartbeat
// requests.

let heartbeatRunning = false;


// ============================
// SHOW OFFLINE SCREEN
// ============================

function showServerOffline(){

    if(serverIsOffline){

        return;

    }


    serverIsOffline = true;


    offlineOverlay.classList.add(
        "active"
    );


    offlineOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


// ============================
// HIDE OFFLINE SCREEN
// ============================

function hideServerOffline(){

    if(!serverIsOffline){

        return;

    }


    serverIsOffline = false;


    offlineOverlay.classList.remove(
        "active"
    );


    offlineOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


// ============================
// VALIDATE SERVER
// ============================

async function validateServer(){

    if(heartbeatRunning){

        return;

    }


    heartbeatRunning = true;


    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            () => {

                controller.abort();

            },
            VALIDATION_TIMEOUT
        );


    try{

        const response =
            await fetch(
                VALIDATION_URL,
                {
                    method:"GET",

                    cache:"no-store",

                    headers:{
                        "Cache-Control":
                            "no-cache"
                    },

                    signal:
                        controller.signal
                }
            );


        clearTimeout(timeout);


        if(!response.ok){

            throw new Error(
                `Validation failed with HTTP ${response.status}`
            );

        }


        const result =
            await response.text();


        if(
            result.trim() !== "YES"
        ){

            throw new Error(
                "Server validation returned an unexpected response."
            );

        }


        // Server is alive.

        hideServerOffline();

    }


    catch(error){

        clearTimeout(timeout);


        // The server is unreachable
        // or validation failed.

        showServerOffline();

    }


    finally{

        heartbeatRunning = false;

    }

}


// ============================
// PREVENT INTERACTION DURING
// SERVER OUTAGE
// ============================

document.addEventListener(
    "keydown",
    event => {

        if(!serverIsOffline){

            return;

        }


        event.preventDefault();

        event.stopPropagation();

    },
    true
);


// ============================
// HEARTBEAT LOOP
// ============================

async function heartbeatLoop(){

    await validateServer();


    setTimeout(
        heartbeatLoop,
        HEARTBEAT_INTERVAL
    );

}


// ============================
// START HEARTBEAT
// ============================

heartbeatLoop();