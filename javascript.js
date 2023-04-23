axios.defaults.headers.common['Authorization'] = 'TumGlLJcWaHWS4AyRV2AOZCy';
let boxTodosOsQuizzes = document.querySelector('.todosQuizzes');
let quizzClicado = {};
let respostasClicadas = 0;
let acertos = 0;

function comparador(){
    return Math.random() -0.5;
}

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

function mostrarQuizz(response){
    quiz = response.data;
    const header = document.querySelector(".quiz-header");
    header.innerHTML = "";
    header.innerHTML += `
        <img src="${quiz.image}"/>
        <p>${quiz.title}</p>
    `
    const tela2 = document.querySelector(".container-tela-2");
    tela2.innerHTML = "";
    for (let i = 0; i < quiz.questions.length; i++){
        let opcoes = "";
        quiz.questions[i].answers.sort(comparador);
        for (let j = 0; j < quiz.questions[i].answers.length; j++){
            const respCorreta = quiz.questions[i].answers[j].isCorrectAnswer;
            let acertou;
            if (respCorreta){
                acertou = "correto";
            } else {
                acertou = "errado";
            }
            opcoes += `
            <figure class="resposta ${acertou}" onclick="selecionarResposta(this)">
                <img src ="$quiz.questions[i].answers[j].image">
                <p class="resposta-texto">${quiz.questions[i].answers[j].text}</p> 
            </figure>`;
        }
        tela2.innerHTML += `
        <section class = "pergunta pergunta-numero-${i+1}">
            <div class = "pergunta-titulo" style="background-color:${quiz.questions[i].color};">
                <h4>${quiz.questions[i].title}</h4>
            </div>
            <div class = "respostas">
                ${opcoes}    
            </div>
        </section>
        `;
    }
}

function buscarQuizz(id){
    const promise = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`)
    promise.then(mostrarQuizz);
}

function entrarQuizz(element){
    document.querySelector(".desktop1").classList.add("esconder");
    document.querySelector(".add-quizz").classList.add("esconder");
    document.querySelector(".tela-2").classList.remove("esconder");
    id = element.getAttribute("id");

    buscarQuizz(id);

}

function selecionaResposta(item){
    const campoRespostas = item.parentNode;
    const campoPerguntas = campoRespostas.parentNode;
    const perguntas = document.querySelectorAll(".pergunta");
    const arrayRespostas = document.querySelectorAll(".figure");

    for (let i = 0; i < arrayRespostas.length; i++){
        arrayRespostas[i].style.opacity = "0.5";
    }
    item.style.opacity = "1";
    permiteClique(arrayRespostas);

}

function removeClique(arrayRespostas){
    for (let i = 0; i < arrayRespostas.length; i++){
        arrayRespostas[i].removeAttribute("onclick");
    }
}

function marcarResposta(campoRespostas, item){
    const respostasCertas = campoRespostas.querySelector(".certo");
    const respostasErradas = campoRespostas.querySelectorAll(".errado");

    respostasCertas.querySelector("p").style.color = "#009C22";

    for(let i =0; i < respostasErradas.length; i++){
        respostasErradas[i].querySelector("p").style.color = "#FF4B4B";
    }
    if (confereResposta(item)){
        acertos++;
    }
    respostasClicadas++;
}

function confereResposta(resposta){
    if (resposta.classList.contains("certo")){
        return true;
    }else {
        return false;
    }
}
renderizaQuizzesDoServidor()