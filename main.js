console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')

//linha relacionada ao preload.js
const path = require('node:path')

// Importação dos métodos conectar e desconectar (módulo de conexão)
const {conectar, desconectar}=require('./database.js')

// Importação do Schema Clientes da camada model
const clientModel=require('./src/models/Clientes.js')

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
                label: 'Clientes'
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
    }catch(error){
        console.log(error)
    }
})
// ====================================================================================================
