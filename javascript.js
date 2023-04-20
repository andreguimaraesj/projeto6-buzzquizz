axios.defaults.headers.common['Authorization'] = 'TumGlLJcWaHWS4AyRV2AOZCy';
let boxTodosOsQuizzes = document.querySelector('.todosQuizzes');
let quizzClicado = {};







let todosQuizzesDoServidor;
function renderizaQuizzesDoServidor(){
    todosQuizzesDoServidor = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
    todosQuizzesDoServidor.then((quiz) =>{
        todosQuizzesDoServidor = quiz.data;
       console.log(todosQuizzesDoServidor);

        for(let i = 0; i < todosQuizzesDoServidor.length; i++){
            boxTodosOsQuizzes.innerHTML += `<div class="quizzDoServidor" onclick="abreQuizz(${todosQuizzesDoServidor[i].id})">
                <div class="tituloDeCadaQuizzDoServidor">${todosQuizzesDoServidor[i].title}</div>
                <img class="imagemQuizzesDoServidor"  src="${todosQuizzesDoServidor[i].image}" >
            </div>`
        }
    } )
};

function abreQuizz(id){
    axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`)
    .then((qui)=> {
        quizzClicado = qui.data;
        console.log(quizzClicado);

    }) 
}

renderizaQuizzesDoServidor();

