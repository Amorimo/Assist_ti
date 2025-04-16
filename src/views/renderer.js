// processo de renderização
//tela principal

console.log("processo de renderização ")

function cliente() {
   // console.log("teste do botão cliente")
    api.clientWindow()
}



function os() {
   // console.log("teste do botão os")
    api.osWindow()
}

// Troca do ícone do banco de dados (Usando a api do preload.js)
api.dbStatus((event, message)=>{
    // Teste do recebimento da mensagem do main
    console.log(message)
    if(message==="conectado"){
        document.getElementById('statusdb').src="../public/img/dbon.png"
    } else{
        document.getElementById('statusdb').src="../public/img/dboff.png"        
    }
})