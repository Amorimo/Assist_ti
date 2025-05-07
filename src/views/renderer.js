// processo de renderização
// tela principal

console.log("processo de renderização")

function cliente() {
    // console.log("teste do botão cliente")
    api.clientWindow()
}

function os() {
    // console.log("teste do botão os")
    api.osWindow()
}

// Troca do ícone do banco de dados (usando a api do preload.js)
api.dbStatus((status) => {
    console.log(status)
    if (status === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
})
