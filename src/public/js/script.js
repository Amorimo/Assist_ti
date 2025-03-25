/*data atualizada no rodapé 
    @Autor Matheus Amorim
*/
function obterData(){
    const dataatual = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

return dataatual.toLocaleDateString('pt-br', options)
}

// executar a função ao iniciar do app 
document.getElementById('dataatual').innerHTML = obterData()

