document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let bombAmount = 20
    let flags = 0
    let squares = []
    let isGameOver = false

    function createBoard() {

        // random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        // console.log(bombsArray)
        // console.log(emptyArray)

        const gameArray = emptyArray.concat(bombsArray)
        // console.log(gameArray)

        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)
        // console.log(shuffledArray)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // if (i > 0 && i < 10 && i % 2 != 0) {
            //     square.classList.add('even')
            // }
            // if (i > 9 && i < 19 && i % 2 == 0) {
            //     square.classList.add('even')
            // }
            // if (i > 20 && i < 30 && i % 2 != 0) {
            //     square.classList.add('even')
            // }
            // if (i > 29 && i < 39 && i % 2 == 0) {
            //     square.classList.add('even')
            // }
            // if (i > 40 && i < 50 && i % 2 != 0) {
            //     square.classList.add('even')
            // }
            // if (i > 49 && i < 59 && i % 2 == 0) {
            //     square.classList.add('even')
            // }
            // if (i > 60 && i < 70 && i % 2 != 0) {
            //     square.classList.add('even')
            // }
            // if (i > 69 && i < 79 && i % 2 == 0) {
            //     square.classList.add('even')
            // }
            // if (i > 80 && i < 90 && i % 2 != 0) {
            //     square.classList.add('even')
            // }
            // if (i > 89 && i < 99 && i % 2 == 0) {
            //     square.classList.add('even')
            // }

            // normal click
            square.addEventListener('click', function (e) {
                click(square)
            })

            // control and left click
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        // add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = i % width === 0
            const isRightEdge = i === width - 1

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++

                squares[i].setAttribute('data', total)
                console.log(squares[i])
            }
        }
    }
    createBoard()

    // add flag with right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++
                checkForWin()
            }
            else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
            }
        }
    }

    // click on square actions 
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            // alert('Game Over')
            gameOver(square)
        }
        else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.classList.add('bgColor');
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked');
        square.classList.remove('even')
    }

    // check neighbouring squares once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

        }, 10)
    }

    // game over
    function gameOver(square) {
        console.log("BOOM! Game Over")
        alert("BOOM! Game Over")
        isGameOver = true

        // show all bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        })
    }

    // check for win
    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if (matches === bombAmount) {
                alert('YOU WIN !')
                isGameOver = true
            }
        }
    }
})