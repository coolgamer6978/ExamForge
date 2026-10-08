//NAME OF FILE IS Home_page.js
const menu = document.querySelector(".menu");
const heroSpace = document.querySelector(".hero-space");

// ============================
// MAIN MENU
// ============================

document
    .querySelectorAll(".menu-link")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if(button.id === "qpg-button"){

                    location.replace("/QPG");
                    return;
                }

                if(button.id === "aku-button"){

                    location.replace("/AKU");
                    return;
                }

                if(button.id === "asc-button"){

                    location.replace("/ASC");
                    return;
                }

                if(button.id === "archive-button"){

                    location.replace("/Archive");
                    return;
                }

            }

        );

    });