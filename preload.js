// arquivo de pre carregamento e reforço de segurança na comunicação entre processos (IPC)

//const { contextBridge, ipcRenderer } = require("electron")

// importaçao dos recursos do framework
// contextbridge segunrança | ipcrenderer comunicação
const {contextBridge,ipcRenderer} = require('electron')

// Enviar ao main um pedido para conexão com o banco de dados e troca do icone no processo de renderização(index.html)
ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api',{
    clientWindow: () => ipcRenderer.send('client-Window'),
    osWindow: () => ipcRenderer.send('os-Window'),
    dbStatus:(message)=>ipcRenderer.on('db-status', message),
    newClient:(client)=>ipcRenderer.send('new-client',client),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    
})

function dbStatus(message){
    ipcRenderer.on('db-status',message)
}