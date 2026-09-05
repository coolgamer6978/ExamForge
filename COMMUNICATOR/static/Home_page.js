//NAME OF FILE IS Home_page.js
const menu = document.querySelector(".menu");
const heroSpace = document.querySelector(".hero-space");

// ============================
// MAIN MENU
// ============================

document
    .querySelectorAll(".menu-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if(
                    link.dataset.screen ===
                    "Question Paper Generator"
                ){

                    location.replace("/QPG");
                    return;
                }


                // Navigation for the other pages
                // will be connected later.

            }

        );

    });