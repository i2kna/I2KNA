// I2KNA Sidebar Loader


let depth = "";


if(location.pathname.includes("/archive/")){

    depth = "../../";

}
else if(
    location.pathname.includes("/pages/") ||
    location.pathname.includes("/wallpapers/") ||
    location.pathname.includes("/blog/")
){

    depth = "../";

}

console.log("/I2KNA/components/sidebar.html");

fetch(depth + "components/sidebar.html")

.then(response => {

    if(!response.ok){

        throw new Error("Failed to load sidebar");

    }

    return response.text();

})


.then(data => {


    const sidebar =
        document.getElementById("sidebar");


    sidebar.innerHTML = data;



    const path =
        location.pathname;



    const buttons =
        sidebar.querySelectorAll(".aero-button");



    buttons.forEach(button => {


        const category =
            button.dataset.category;



        if(
            category &&
            path.includes("/" + category + "/")
        ){

            button.classList.add("active");

        }



        const link =
            new URL(button.href).pathname;



        if(link === path){

            button.classList.add("active");

        }


    });


})


.catch(error => {

    console.error(error);

});
