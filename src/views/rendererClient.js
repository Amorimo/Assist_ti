function buscarCEP() {
    let cep = document.getElementById("inputCEPClient").value.replace(/\D/g, ""); // Remove caracteres não numéricos
    console.log("CEP digitado:", cep);

    if (cep.length !== 8) {
        console.warn("CEP inválido! Digite um CEP com 8 números.");
        alert("CEP inválido! Digite um CEP com 8 números.");
        return;
    }

    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`;
    console.log("Buscando dados na URL:", urlAPI);

    fetch(urlAPI)
        .then(response => {
            console.log("Resposta recebida:", response);
            return response.json();
        })
        .then(dados => {
            console.log("Dados recebidos:", dados);

            if (dados.erro) {
                console.error("CEP não encontrado!");
                alert("CEP não encontrado!");
                return;
            }

            // Preenchendo os campos
            document.getElementById("inputAddressClient").value = dados.logradouro || "";
            document.getElementById("inputNeighborhoodClient").value = dados.bairro || "";
            document.getElementById("inputCityClient").value = dados.localidade || "";
            document.getElementById("inputUFClient").value = dados.uf || "";

            console.log("Campos preenchidos com sucesso!");
        })
        .catch(error => console.error("Erro ao buscar CEP:", error));
}
// Vetor global que será usado na manipulação dos dados
let arrayClient=[]

// Capturar o foco na busca pelo nome do cliente
// A constante foco obtem o elemento HTML (input) identificada como searchClient
const foco = document.getElementById('searchClient')

// Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    // Desabilitar botões
    btnUpdate.disable = true
    btnUpdate.disable = true

    // Foco na busca do cliente
    foco.focus()
})

// Captura dos dados dos input do funcionario (Passo 1: fluxo)
let frmClient = document.getElementById('frmClient')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let emailClient = document.getElementById('inputEmailClient')
let phoneClient = document.getElementById('inputPhoneClient')
let cepClient = document.getElementById('inputCEPClient')
let addressClient = document.getElementById('inputAddressClient')
let numberClient = document.getElementById('inputNumberClient')
let complementClient = document.getElementById('inputComplementClient')
let neighborhoodClient = document.getElementById('inputNeighborhoodClient')
let cityClient = document.getElementById('inputCityClient')
let ufClient = document.getElementById('inputUFClient')

// 
// Evento associado ao botão submit (Uso das validações do HTML)
frmClient.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento HTML
    event.preventDefault()

    // Teste importante (Recebimento dos dados do formulário - Passo 1 do fluxo)
    console.log(nameClient.value, cpfClient.value, emailClient.value, phoneClient.value, cepClient.value, addressClient.value, numberClient.value, numberClient.value, complementClient.value, neighborhoodClient.value, cityClient.value, ufClient.value)


    // Criar um objeto para armazenar os dados do cliente antes de enviar ao main
    const client = {
        nameCli: nameClient.value,
        cpfCli: cpfClient.value,
        emailCli: emailClient.value,
        phoneCli: phoneClient.value,
        cepCli: cepClient.value,
        addressCli: addressClient.value,
        numberCli: numberClient.value,
        complementCli: complementClient.value,
        neighborhoodCli: neighborhoodClient.value,
        cityCli: cityClient.value,
        ufCli: ufClient.value
    }


    api.newClient(client)
})

// ============================================================
// == Reset form ==============================================
function resetForm() {
    // Limpar os campos e resetar o formulário com as configurações pré definidas
    location.reload()
}

// Recebimento do pedido do main para resetar o form
api.resetForm((args) => {
    resetForm()
})

// == Fim - reset form ========================================
// ============================================================

// ============================================================
// == CRUD Read==============================================

function buscarCliente() {
    // console.log("Teste do Botão buscar")
    // Passo 1: Capturar o nome do cliente
    let name = document.getElementById('searchClient').value
    console.log(name) // Teste do passo 1

    // Passo 2: Envio do nome ao main
    api.searchName(name)

    // Recebimento dos dados do cliente
    api.renderClient((event, dataClient)=>{
        console.log(dataClient) // Teste do passo 5

        // Passo 6: renderizar os dados do cxliente no formulário
        // Criar um vetor global para manipulação dos dados
        // Criar constante para converter os dados (string) para o formato JSON (JSON.parse)
        // Usar o laço forEach para percorrer o vetor e setar os campos (caixas de texto) do formulári
        const dadosCliente=JSON.parse(dataClient)
        // Atribuir ao vetor os dados do cliente
        arrayClient=dadosCliente
        
        // Extrair os dados do cliente
        arrayClient.forEach((c) => {
            nameClient.value=c.nomeCliente,
            cpfClient.value=c.cpfCliente,
            emailClient.value=c.emailCliente,
            phoneClient.value=c.foneCliente,
            cepClient.value=c.cepCliente
            addressClient.value=c.logradouroCliente,
            numberClient.value=c.numeroCliente,
            complementClient.value=c.complementoCliente,
            neighborhoodClient.value=c.bairroCliente,
            cityClient.value=c.cidadeCliente




        });

    })
}


// == Fim - Crud Read ========================================
// ============================================================