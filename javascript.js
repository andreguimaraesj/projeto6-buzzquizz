axios.defaults.headers.common['Authorization'] = 'TumGlLJcWaHWS4AyRV2AOZCy';
let boxTodosOsQuizzes = document.querySelector('.todosQuizzes');



let todosQuizzesDoServidor;
function renderizaQuizzesDoServidor(){
    todosQuizzesDoServidor = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
    todosQuizzesDoServidor.then((quiz) =>{
        todosQuizzesDoServidor = quiz.data;

        for(let i = 0; i < todosQuizzesDoServidor.length; i++){
            boxTodosOsQuizzes.innerHTML += `<div class="quizzDoServidor">
                <div class="tituloDeCadaQuizzDoServidor">${todosQuizzesDoServidor[i].title}</div>
                <img class="imagemQuizzesDoServidor" src="${todosQuizzesDoServidor[i].image}">
            </div>`
        }
    } )
};

renderizaQuizzesDoServidor();

