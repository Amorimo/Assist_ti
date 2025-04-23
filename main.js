console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')

const { shell } = require('electron')


//linha relacionada ao preload.js
const path = require('node:path')

// Importação dos métodos conectar e desconectar (módulo de conexão)
const {conectar, desconectar}=require('./database.js')

// Importação do Schema Clientes da camada model
const clientModel=require('./src/models/Clientes.js')

// Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF } = require('jspdf')

// Importação da biblioteca fs (nativa do JavaScript) para manipulação de arquivos (no caso arquivos pdf)
const fs = require('fs')
const { type } = require('node:os')


// Janela principal
let win
const createWindow = () => {
    // a linha abaixo define o tema (claro ou escuro)
    nativeTheme.themeSource = 'system' //(dark ou light)
    win = new BrowserWindow({
        width: 800,
        height: 600,
        //autoHideMenuBar: true,
        //minimizable: false,
        resizable: false,
        // ativar preload.js
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })



    // menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
    //recebimento dos pedidos do renderizador para abertura de janelas

}

    ipcMain.on('client-Window',() => {
        clientWindow()
    })

    ipcMain.on('os-Window',() => {
        osWindow()
    })


// Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'system'
    // a linha abaixo obtém a janela principal
    const main = BrowserWindow.getFocusedWindow()
    let about
    // Estabelecer uma relação hierárquica entre janelas
    if (main) {
        // Criar a janela sobre
        about = new BrowserWindow({
            width: 360,
            height: 220,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true
        })
    }
    //carregar o documento html na janela
    about.loadFile('./src/views/sobre.html')
}

// Janela clientes
let client
function clientWindow() {
    nativeTheme.themeSource = 'system'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        client = new BrowserWindow({
            width: 800,
            height: 600,
            //autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true,
            // ativar preload.js
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
        })
    }
    client.loadFile('./src/views/cliente.html')  
    client.center() // iniciar no centro da tela
}


// Janela OS
let os
function osWindow() {
    nativeTheme.themeSource = 'system'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        os = new BrowserWindow({
            width: 1010,
            height: 720,
          //  autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true
        })
    }
    os.loadFile('./src/views/os.html')   
    os.center() //iniciar no centro da tela
}

// Iniciar a aplicação
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//reduzir logs não críticos
app.commandLine.appendSwitch('log-level', '3')

// Iniciar a conexão com o banco de dados (Pedido direto do preload.js)
ipcMain.on('db-connect', (event)=>{
    let conectado=conectar()
    // Se conectado for igual a true 
    if (conectado){
        // Enviar uma mensgaem para o renderizado poder trocar o ícone, criar um delay de 0.5s para sincronizar a nuvem
        setTimeout(() => {
            event.reply('db-status', "conectado")  
        }, 500); //500ms
       
    }
})



// Importante! Desconectar do banco de dados quando a aplicação for encerrada
app.on('before-quit',()=>{
     desconectar()
})

// template do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow()
            },
            {
                label: 'OS',
                click: () => osWindow()
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Relatórios',
        submenu: [
            {
                label: 'Clientes',
                click: () => relatorioClientes()
            },
            {
                label: 'OS abertas'
            },
            {
                label: 'OS concluídas'
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload',
                accelerator:'F5'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]
// ====================================================================================================
// Clientes - CRUD Create

// Recebimento do objeto que contém os daods do cliente
ipcMain.on('new-client', async(event,client)=>{
    // Importante! Teste de recebimento dos dados do cliente
    console.log(client)

    // Cadastrar a estrutura de dados no banco de dados MongoDB
    try{
        // Criar nova estrutura de dados usando a class modelo
        // Importante! Os atributos precisam ser identicos ao modelo de dados Cliente.js
        const newClient=new clientModel({
            nomeCliente:client.nameCli,
            cpfCliente:client.cpfCli,
            emailCliente:client.emailCli,
            foneCliente:client.phoneCli,
            cepCliente:client.cepClient,
            logradouroCliente:client.addressCli,
            numeroCliente:client.numberCli,
            complementoCliente:client.complementCli,
            bairroCliente:client.neighborhoodCli,
            cidadeCliente:client.cityCli,
            ufCliente:client.ufCli
        })
        await newClient.save()    
     // Mensagem de confirmação
     dialog.showMessageBox({
        //customização
        type: 'info',
        title: "Aviso",
        message: "Cliente adicionado com sucesso",
        buttons: ['OK']
    }).then((result) => {
        //ação ao pressionar o botão (result = 0)
        if (result.response === 0) {
            //enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rótulo 'reset-form' do preload.js
            event.reply('reset-form')
        }
    })
} catch (error) {
    // se o código de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuário
    if (error.code === 11000) {
        dialog.showMessageBox({
            type: 'error',
            title: "Atenção!",
            message: "CPF já está cadastrado\nVerifique se digitou corretamente",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                // limpar a caixa de input do cpf, focar esta caixa e deixar a borda em vermelho
            }
        })
    }
    console.log(error)
}
})

// == Fim - Clientes - CRUD Create
// ============================================================


// ============================================================
// == Relatório de clientes ===================================

async function relatorioClientes() {
try {
    // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
    const clientes = await clientModel.find().sort({ nomeCliente: 1 })
    // teste de recebimento da listagem de clientes
    //console.log(clientes)
    // Passo 2:Formatação do documento pdf
    // p - portrait | l - landscape | mm e a4 (folha A4  210x 297mm)
    const doc = new jsPDF('p', 'mm', 'a4')
    //Inserir imagem do documento PDF
    // imagePath (caminho da imagem que será inserida no pdf)
    // imageBase64 (uso da bibilioteca fs para ler o arquivo no formato png)
    const imagePath = path.join(__dirname,'src','public','img','logo.png')
    const imageBase64 = fs.readFileSync(imagePath,{encoding:'base64'})
    doc.addImage(imageBase64, 'PNG', 5,8) // (5em, 8mm x,y)

    // definir o tamanho da fonte (tamanho equivalente ao word)
    doc.setFontSize(18)
    // escrever um texto (título)
    doc.text("Relatório de clientes", 14, 45)//x, y (mm)
    // inserir a data atual no relatório
    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(12)
    doc.text(`Data: ${dataAtual}`, 165, 10)
    // variável de apoio na formatação
    let y = 60
    doc.text("Nome", 14, y)
    doc.text("Telefone", 80, y)
    doc.text("E-mail", 130, y)
    y += 5
    // desenhar uma linha
    doc.setLineWidth(0.5) // expessura da linha
    doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)
    // Renderizar os clientes cadastrados no banco
    y+=10 // Espaçamento da linha
    // Percorres o vetor 
    clientes.forEach((c)=>{
        // Adicionar outra página se a folha inteira for preechida (estratégia é saber o tamanho da folha)
        // Folha A4 tem y=297mm
        if (y > 280){
            doc.addPage()
            y=20 // Resetar a variável y

            doc.text("Nome",14,y)
            doc.text("Telefone",80,y)
            doc.text("E-mail",139,y)
            y+=5
            doc.setLineWidth(0.5)
            doc.line(10,y,200,y)
            y+=10
        }
        doc.text(c.nomeCliente, 14,y)
        doc.text(c.foneCliente, 80,y)
        doc.text(c.emailCliente || "N/A", 130,y)
        y+=10 // Quebra linha
    })

     // Adicionar numeração automática de páginas
     const paginas=doc.internal.getNumberOfPages()
     for(let i = 1; i <= paginas; i++){
         doc.setPage(i)
         doc.setFontSize(10)
         doc.text(`Página ${i} de ${paginas}`,105,290,{align:'center'})
     }

    // Definir o caminho do arquivo temporário e nome do arquivo
    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'clientes.pdf')
    // Renderizar os clientes cadastrados no banco

    // salvar temporariamente o arquivo
    doc.save(filePath)
    // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
    shell.openPath(filePath)
} catch (error) {
    console.log(error)
}
}

// == Fim - relatório de clientes =============================
// ============================================================


// ============================================================
// == CRUD Read ===================================

ipcMain.on('search-name',async (event,name)=> {
    // console.log("Teste IPC search-name")
    // console.log(name) // Teste do passo 2 (Importante!)
    // Passos 3 e 4: busca dos dados do cliente no banco
    // find({nomeCliente:name}) - Busca pelo nome
    // RegExp(name,i) i=(Insensitive/ Ignorar maiúsculo e minúsculo)
    try {
        const dataClient=await clientModel.find({
            nomeCliente:new RegExp(name,'i')
        })
        console.log(dataClient) // Teste passos 3 e 4 (Importante!)
        // enciando os dados do cliente ao rendererCliente
        // Obs: IPC só trabalha com string, então é necessário converter o JSON para string JSON.stringify(dataClient))
        event.reply('render-client',JSON.stringify(dataClient))
    } catch (error) {
        console.log(error)
    }
})

// == Fim - CRUD Read =============================
// ============================================================
ipcMain.on('validate-search',()=>{
    dialog.showMessageBox({
        type:'warning',
        title:"Atenção!",
        message:"Preencha o cmapo de busca",
        buttons:['OK']
    })
})

ipcMain.on('search-name',async (event,name)=>{
    try{
        const dataClient=await clientModel.findOneAndReplace({
            nomeCliente: new RegExp(name, 'i')
        })
        console.log(dataClient)
        
        if (dataClient.length===0){
            dialog.showMessageBox({
                type:'question',
                title:"Aviso",
                message:"Cliente não cadastrado.\n Deseja cadastrar esse cliente?",
                defaultId:0,
                buttons:['Sim','Não']
        
            }).then((result)=>{
                if(result.response===0){
                    // Envia ao renderizador um pedido para 
                    event.reply('set-client')
                } else{
                    event.reply('reset-form')
                }
            })
        }
        event.reply('render-client',JSON.stringify(dataClient))
    } catch(error){
        console.log(error)
    }
})

