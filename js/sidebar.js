// I2KNA Sidebar Loader


const root = "/I2KNA/";


// Load sidebar

fetch(root + "components/sidebar.html")

.then(response => {

    if(!response.ok){

        throw new Error("Failed to load sidebar");

    }

    return response.text();

})


.then(data => {


    const sidebar = document.getElementById("sidebar");


    if(!sidebar){

        return;

    }


    sidebar.innerHTML = data;



    // 現在のページ

    let currentPath = location.pathname;



    // /I2KNA/ を /I2KNA/index.html として扱う

    if(currentPath.endsWith("/")){

        currentPath += "index.html";

    }



    const buttons =
        sidebar.querySelectorAll(".aero-button");



    buttons.forEach(button => {


        // リンク先取得

        let link =
            new URL(button.href).pathname;



        // /I2KNA/ を /I2KNA/index.html として扱う

        if(link.endsWith("/")){

            link += "index.html";

        }



        // active解除

        button.classList.remove("active");



        // 完全一致

        if(link === currentPath){

            button.classList.add("active");

        }



        // カテゴリ判定

        const category =
            button.dataset.category;



        if(
            category &&
            currentPath.includes("/" + category + "/")
        ){

            button.classList.add("active");

        }


    });


})


.catch(error => {

    console.error(error);

});
