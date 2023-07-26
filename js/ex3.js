const startButton = document.getElementById("playButton");
const sittingButton = document.getElementById("sittingInput");
const moves = document.getElementById("stepsMove");
const gameContainer = document.querySelector(".grid-container");
const error = document.getElementById("errorMsg");
const result = document.getElementById("result");
const tableHtml = document.getElementById("TableHtml");
const name = document.getElementById("productName").value.trim();

let movesCount = 0;
let cards;
let firstCard = false;
let secondCard = false;
let winCount;
let list = [];
let scoreVal = 0;
let Rank = 1;

//list of all the photo
const items = [
    {'name': '0', 'image': 'images/0.jpg'},
    {'name': '1', 'image': 'images/1.jpg'},
    {'name': '2', 'image': 'images/2.jpg'},
    {'name': '3', 'image': 'images/3.jpg'},
    {'name': '4', 'image': 'images/4.jpg'},
    {'name': '5', 'image': 'images/5.jpg'},
    {'name': '6', 'image': 'images/6.jpg'},
    {'name': '7', 'image': 'images/7.jpg'},
    {'name': '8', 'image': 'images/8.jpg'},
    {'name': '9', 'image': 'images/9.jpg'},
    {'name': '10','image': 'images/10.jpg'},
    {'name': '11','image': 'images/11.jpg'},
    {'name': '12','image': 'images/12.jpg'},
    {'name': '13','image': 'images/13.jpg'},
    {'name': '14','image': 'images/14.jpg'},
    {'name': '15','image': 'images/15.jpg'},
];

function getDelay(){
    return document.getElementById("delayNum").value;
}
function getNumRows() {
    return document.getElementById("numOfRows").value;
}
function getNumCols() {
    return document.getElementById("numOfCols").value;
}

function checkSquare() {
    return !(getNumCols() * getNumRows() % 2);
}

function pushObj(){
    list.push(Rank);
    list.push(document.getElementById("productName").value.trim());
    list.push(scoreVal);
}

function addList(){

    pushObj();
    displayProducts(buildTable());
    displayProducts1(buildTable());
    Rank+=1;
}
//convert to html code
const displayProducts = (html) => { document.getElementById("TableId").innerHTML = html; }
const displayProducts1 = (html) => { document.getElementById("TableHtml").innerHTML = html; }

//build the table
function buildTable(){
    let counter = 0;
    let str = "<table class=\"table1\"><thead>" +
        "<tr><th>Rank</th>" +
        "<th>Player</th>" +
        "<th>Score</th></tr></thead><tbody>";

    str += "<tr>";
    for (const i of list){
        str += "<td>" + [i] + "</td>"
        counter +=1;
        if(counter === 3)
        {
            str += "</tr>";
            str += "<tr>";
            counter = 0;
        }
    }
    str += "</tr>";
    str += "</tbody></table>";
    return str;
}
//count the moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};
//Pick random objects from the items array
const generateRandom = (size) => {
    let tempArray = [...items];
    let cardValues = [];
    size = (getNumCols() * getNumRows()) / 2;
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};
//open the settings
document.getElementById("sitting").addEventListener(
        "click", () => {
            if (checkSquare()){
                sittingButton.hidden = false;
                startButton.hidden = true;
                error.hidden = true;
            }
            else {
                sittingButton.hidden = false;
                startButton.hidden = true;
                error.hidden = false;
            }
        }, false);

//Play The game press play button
document.getElementById("play").addEventListener(
        "click", () => {
            result.innerHTML = "";

            if (checkSquare()) {
                sittingButton.hidden = true;
                startButton.hidden = false;
                error.hidden = true;
                tableHtml.hidden = true;
                console.log(name);
                movesCount = 0;
                moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
                winCount = 0;
                let cardValues = generateRandom();
                matrixGenerator(cardValues);
            } else {
                sittingButton.hidden = true;
                startButton.hidden = true;
                error.hidden = false;
            }
    }, false);

//stop the game
document.getElementById("stop").addEventListener(
    "click", stopGame = () => {
        sittingButton.hidden = false;
        startButton.hidden = true;
        error.hidden = true;
        scoreVal = 0;
    }, false);


//creat the matrix and grid
function creatMatrix(cardValues){
    const size1 = getNumRows() * getNumCols();
    for (let i = 0; i < size1; i++) {
        gameContainer.innerHTML += `
         <div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after">
                <img src="${cardValues[i].image}" class="image"/>
            </div>
         </div>`;
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${getNumCols()},auto)`;
    gameContainer.style.gridTemplateRows    = `repeat(${getNumRows()},auto)`;
}
//make the matrix of the cards
const matrixGenerator = (cardValues) => {

    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.51); //shuffle

    creatMatrix(cardValues);

    //Cards
    cards = document.querySelectorAll(".card-container");
    let firstCardValue;
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue === secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        winCount += 1;
                        scoreVal += 5;
                        if (winCount === Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `
                             <h1>Game Over! good job ${document.getElementById("productName").value.trim()}</h1>
                             <h2>Number Of Cards Played: ${(getNumCols()*getNumRows())/2}</h2>
                             <h4>Score: ${scoreVal}</h4>
                             <h4>Moves: ${movesCount}</h4>`;
                             addList();
                             tableHtml.hidden = false;
                             stopGame();
                        }
                    } else {
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        console.log(getDelay());
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, getDelay());
                    }
                }
            }
        });
    });
};



