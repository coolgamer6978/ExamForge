// ==================================================
// EXAMFORGE UNIVERSAL LOADING SCREEN
// ==================================================
//
// This file is loaded by every ExamForge HTML page.
//
// Responsibilities:
//
// 1. Automatically detect ExamForge fetch requests.
// 2. Show a full-screen loading overlay while requests
//    are being processed.
// 3. Keep the overlay visible while ANY request remains
//    active.
// 4. Hide the overlay automatically when all requests
//    have finished.
// 5. Correctly handle simultaneous requests.
// 6. NEVER modify or reset application data/UI.
// ==================================================


// ============================
// LOADING OVERLAY
// ============================

const loadingOverlay =
    document.createElement("div");

loadingOverlay.id =
    "examforge-loading-overlay";


loadingOverlay.innerHTML = `

    <div class="examforge-loading-content">

        <img
            class="examforge-loading-logo"
            src="/static/Group%208.svg"
            alt="ExamForge logo">

        <h1>
            ExamForge
        </h1>

        <h2>
            Loading . . .
        </h2>

        <p>
            Processing your request.
        </p>

        <p>
            Please wait.
        </p>

    </div>

`;


// ============================
// LOADING OVERLAY CSS
// ============================

const loadingStyle =
    document.createElement("style");

loadingStyle.textContent = `

    #examforge-loading-overlay{

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


    #examforge-loading-overlay.active{

        display:flex;

    }


    .examforge-loading-content{

        width:min(
            760px,
            calc(100% - 40px)
        );

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

    }


    .examforge-loading-logo{

        width:120px;

        height:120px;

        display:block;

        margin-bottom:24px;

    }


    .examforge-loading-content h1{

        margin:0 0 24px;

        color:#f2f2f2;

        font-size:40px;

        font-weight:600;

        letter-spacing:.5px;

    }


    .examforge-loading-content h2{

        margin:0 0 18px;

        color:#f2f2f2;

        font-size:28px;

        font-weight:600;

    }


    .examforge-loading-content p{

        margin:0 0 10px;

        color:#a7abb2;

        font-size:20px;

        line-height:1.5;

    }


    @media(max-width:700px){

        .examforge-loading-logo{

            width:95px;

            height:95px;

        }


        .examforge-loading-content h1{

            font-size:32px;

        }


        .examforge-loading-content h2{

            font-size:24px;

        }


        .examforge-loading-content p{

            font-size:17px;

        }

    }

`;


// Add the overlay and its CSS to the page.

document.head.appendChild(
    loadingStyle
);

document.body.appendChild(
    loadingOverlay
);


// ============================
// STATE
// ============================
//
// This counter belongs ONLY to this
// browser tab/page.
//
// It is NOT shared with other PCs.
//
// 0 = no active requests
// 1+ = one or more active requests
// ============================

let activeRequests = 0;

const LOADING_SHOW_DELAY = 150;
const LOADING_MINIMUM_DISPLAY_TIME = 300;

let loadingShowTimer = null;
let loadingHideTimer = null;
let loadingShownAt = 0;

// ============================
// IGNORED REQUEST PATHS
// ============================

const LOADING_SCREEN_IGNORED_PATHS = [
    "/",
    "/QPG",
    "/ASC",
    "/AKU",
    "/Archive",
    "/validation"
];

// ============================
// SHOW LOADING SCREEN
// ============================

function showLoadingScreen(){

    if(loadingHideTimer !== null){

        clearTimeout(
            loadingHideTimer
        );

        loadingHideTimer = null;

    }

    if(
        loadingOverlay.classList.contains(
            "active"
        )
    ){

        return;

    }

    loadingShownAt =
        performance.now();

    loadingOverlay.classList.add(
        "active"
    );

    loadingOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


// ============================
// HIDE LOADING SCREEN
// ============================

function hideLoadingScreen(){

    loadingOverlay.classList.remove(
        "active"
    );

    loadingOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


// ============================
// UPDATE LOADING SCREEN
// ============================

function updateLoadingScreen(){

    // ==========================================
    // REQUESTS ARE ACTIVE
    // ==========================================

    if(activeRequests > 0){

        // A hide may have been scheduled,
        // but another request is still active.

        if(loadingHideTimer !== null){

            clearTimeout(
                loadingHideTimer
            );

            loadingHideTimer = null;

        }


        // Loading screen is already visible.

        if(
            loadingOverlay.classList.contains(
                "active"
            )
        ){

            return;

        }


        // Start the 150 ms delay.

        if(loadingShowTimer === null){

            loadingShowTimer = setTimeout(
                () => {

                    loadingShowTimer = null;

                    // The request may have finished
                    // during the 150 ms delay.

                    if(activeRequests > 0){

                        showLoadingScreen();

                    }

                },
                LOADING_SHOW_DELAY
            );

        }

        return;

    }


    // ==========================================
    // NO REQUESTS ARE ACTIVE
    // ==========================================

    // Cancel a pending 150 ms show.

    if(loadingShowTimer !== null){

        clearTimeout(
            loadingShowTimer
        );

        loadingShowTimer = null;

    }


    // It never became visible.

    if(
        !loadingOverlay.classList.contains(
            "active"
        )
    ){

        return;

    }


    // ==========================================
    // ENFORCE 300 ms MINIMUM DISPLAY TIME
    // ==========================================

    const elapsed =
        performance.now() -
        loadingShownAt;

    const remaining =
        Math.max(
            0,
            LOADING_MINIMUM_DISPLAY_TIME -
            elapsed
        );


    if(remaining === 0){

        hideLoadingScreen();

        return;

    }


    // Keep the screen visible until the
    // minimum display time has passed.

    if(loadingHideTimer === null){

        loadingHideTimer = setTimeout(
            () => {

                loadingHideTimer = null;

                // A new request may have started
                // while waiting.

                if(activeRequests === 0){

                    hideLoadingScreen();

                }

            },
            remaining
        );

    }

}
// ============================
// Helper for ignoring
// ============================

function isLoadingScreenIgnored(request){

    const url =
        request instanceof Request
            ? new URL(request.url, window.location.origin)
            : new URL(
                String(request),
                window.location.origin
            );

    return LOADING_SCREEN_IGNORED_PATHS.includes(
        url.pathname
    );

}

// ============================
// INTERCEPT FETCH
// ============================
//
// Every existing fetch() in ExamForge
// automatically passes through here.
//
// Existing code:
//
//     await fetch(...)
//
// does NOT need to change.
// ============================

const originalFetch =
    window.fetch;


window.fetch = async function(...args){

    if(isLoadingScreenIgnored(args[0])){

        return await originalFetch.apply(
            this,
            args
        );

    }


    activeRequests++;

    updateLoadingScreen();


    try{

        return await originalFetch.apply(
            this,
            args
        );

    }

    finally{

        activeRequests--;

        updateLoadingScreen();

    }

};


// ============================
// PREVENT INTERACTION DURING
// REQUEST PROCESSING
// ============================

document.addEventListener(
    "keydown",
    event => {

        if(activeRequests <= 0){

            return;

        }



        event.preventDefault();

        event.stopPropagation();

    },
    true
);

document.addEventListener(
    "pointerdown",
    event => {

        if(activeRequests <= 0){
            return;
        }

        event.preventDefault();
        event.stopPropagation();

    },
    true
);