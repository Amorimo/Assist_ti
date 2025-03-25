/**
 * Módulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

// Importação do mongoose
const mongoose=require('mongoose')

// Acesso ao banco de dados
// ip/link -> Autenticação
// Obs: Atlas(obter via Compass)
// Para criar um banco de dados personalizado basta escolher um nome no final da String da url (ex: dbclientes)
const url='mongodb+srv://admin:123senac@atum.dqeot.mongodb.net/dbsistema'


// Criar uma variável de apoio para validação
let conectado=false

// Método para conectar o banco de dados
const conectar=async()=>{
    // Validação (Se não estiver conectado, conectar)
    if(!conectado){
        // Conectar com o banco de dados
        // try catch-tratamento de exceções
        try {
            await mongoose.connect(url)
            conectado=true// Conectar
            console.log("MongoDB conectado")
            return true
        } catch (error) {
            // Se o código de erro = 8000 (Autenticação)
            if(error.code=8000){
                console.log("Erro de autenticação")
            } else{
                console.log(error)
            }
        }
    }
}

const desconectar=async()=>{
    // Validação (Se estiver conectado, desconectar)
    if(conectado){
        // desconectar com o banco de dados
        // try catch-tratamento de exceções
        try {
            await mongoose.disconnect(url)// Desconectar
            conectado=false // Setar variável
            console.log("MongoDB desconectado")
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

// Exportar para o main os métodos conectar e desconectar
module.exports={conectar,desconectar}
