const { contextBridge, ipcRenderer } = require('electron')

// Solicita conexão com o banco ao iniciar
ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('client-Window'),
    osWindow: () => ipcRenderer.send('os-Window'),
    dbStatus: (callback) => ipcRenderer.on('db-status', (event, status) => callback(status)),
    newClient: (client) => ipcRenderer.send('new-client', client),
    resetForm: (callback) => ipcRenderer.on('reset-form', () => callback()),
    searchName: (name) => ipcRenderer.send('search-name', name),
    renderClient: (callback) => ipcRenderer.on('render-client', (event, dataClient) => callback(dataClient)),
    validateSearch: () => ipcRenderer.send('validate-search'),
    setClient: (callback) => ipcRenderer.on('set-client', () => callback()),
    deleteClient: (id) => ipcRenderer.send('delete-client', id),
    updateCliente: (client) => ipcRenderer.send('update-client', client),
    searchOS:() => ipcRenderer.send('search-os'),
    searchClients:(clients) => ipcRenderer.send('search-clients', clients),
    listClients:(clients) => ipcRenderer.on('list-clients', clients)
})
