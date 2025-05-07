// ==============================================================================
// ========= Busca Avançada - Estilo Google =============

// Capturar os id referente aos campos do nome
const input = document.getElementById('inputSearchClient')

// Capturar o ID do ul da lista de sugestôes de clientes
const suggestionList = document.getElementById('viewListSuggestion')

// Capturar os campos que vão ser preenchidos
let idClient = document.getElementById('inputidClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')

// Vetor usado na manipulação (Filtragem) dos dados
let arrayClients=[]

// Captura em tempo real do input (Digitação de caracteres na caixa de busca)
input.addEventListener('input', ()=>{
    // Passo 1: Capturar o que for digitado na caixa de busca e converter tudo para letrar minúsculas (Auxilio ao filtro)
    const search = input.value.toLowerCase()
    // console.log(search)  Teste de apoio a lógica

    // Passo 2: Enviar ao main um pedido de busca de clientes pelo nome (Via preload - api IPC)
    api.searchClients()


    // Recebimento dos clientes do vanco de dados (Passo 3)
    api.listClients((event, clients)=>{
        console.log(clients) // Teste do passo 3
        // Converter para JSON os dados dos clientes recebidos
        const dataClients = JSON.parse(clients)

        // Armazenar no vetor os dados dos clientes
        arrayClients = dataClients

        // Passo 4: Filtrar os dados dos clientes extraindo nome que tenham relação com os caracteres digitados na busca em tempo real
        const results =  arrayClients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0,10) // Máximo 10 resultados
        // console.log(results) Importante para o entendimento

        // Limpar a lista a cada caractere digitado
        suggestionList.innerHTML = ""

        // Para cada resultado gerar um item da lista <li>
        results.forEach(c =>{
            // Criar o elemento li
            const item = document.createElement('li')

            // Adicionar classes bootstrap a cada li criado
            item.classList.add('list-group-item', 'list-group-item-action')

            // Exibir o nome do cliente
            item.textContent = c.nomeCliente

            // Adicionar os li criados da lista ul
            suggestionList.appendChild(item)

            // Adicionar um evento de clique no item da lista para preencher os campos do formulário
            item.addEventListener('click', ()=>{
                idClient.value = c._id
                nameClient.value = c.nomeCliente
                phoneClient.value = c.foneCliente

                // Limpar o input e recolher a lista
                input.value = ""
                suggestionList.innerHTML = ""

            })
        })
        

    })

})

// Ocultar a lista ao clicar fora
document.addEventListener('click', (event)=>{

    // Esconder a lista se ela existir e estiver ativa
    if(!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})


// ========= Fim Busca Avançada ==========
// ==============================================================================




// Buscar OS
function inputOS(){
    // console.log("teste do botão")
    api.searchOS()
}

function resetForm() {
    //limpar os campos e resetar o formulario com as configuraçoes pré definidas
    
    location.reload()
}