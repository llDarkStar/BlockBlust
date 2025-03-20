window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("map");
    const ctx = canvas.getContext("2d");
    const canvasRect = canvas.getBoundingClientRect();

    const setCanvasSize = () => {
      const viewportWidth = window.innerWidth * 0.6;
      const viewportHeight = window.innerHeight * 0.6;
      const minSize = Math.min(viewportWidth, viewportHeight);

      canvas.width = minSize;
      canvas.height = minSize;
  };

    setCanvasSize();

    window.addEventListener("resize", setCanvasSize); 

    const cellSize = canvas.width / 8;
    const gridCount = 8;

    const board = Array.from({ length: gridCount }, () => Array(gridCount).fill(0));

    let gameOver = false;

    const score = document.getElementById('score');
    const currentScore = parseInt(score.textContent);
    score.textContent = 0;

    function drawGrid() {
      ctx.strokeStyle = "#122d52";
      ctx.lineWidth = 2;

      const offset = ctx.lineWidth / 2;

      for (let i = 1; i < gridCount; i++) {
          const position = i * cellSize;

          ctx.beginPath();
          ctx.moveTo(0, position + offset);
          ctx.lineTo(cellSize * gridCount, position + offset);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(position + offset, 0);
          ctx.lineTo(position + offset, cellSize * gridCount);
          ctx.stroke();
      }

      function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }

      for (let row = 0; row < gridCount; row++) {
        for (let col = 0; col < gridCount; col++) {
          if (board[row][col] === 1) {
            const x = col * cellSize;
            const y = row * cellSize;
      
            // Создаём линейный градиент сверху вниз
            const gradient = ctx.createLinearGradient(x, y, x, y + cellSize);
            gradient.addColorStop(0, '#3090ff');
            gradient.addColorStop(0.5, '#62b0ff');
            gradient.addColorStop(1, '#1f73cc');
      
            // Настраиваем тень (в Canvas нельзя сделать inset напрямую)
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
      
            // Рисуем скруглённый прямоугольник
            drawRoundedRect(ctx, x, y, cellSize, cellSize, 4);
      
            // Заливаем градиентом
            ctx.fillStyle = gradient;
            ctx.fill();
      
            // Обводка
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(255,255,255,0.5)'; // условный "ridge"
            ctx.stroke();
      
            // Отключаем тень, если хотим, чтобы тень не повлияла
            // на последующие элементы
            ctx.shadowColor = 'transparent';
          }
        }
      }
    }

    function renderEmptyBoard() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
    }
    renderEmptyBoard();


    const T_SHAPE = [
      [0, 1, 0],
      [1, 1, 1],
    ];
    const O_SHAPE = [
      [1, 1],
      [1, 1],
    ];
    const L_SHAPE = [
      [0, 0, 1],
      [1, 1, 1],
    ];
    const E_SHAPE = [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1],
      ];
    const D_SHAPE = [
        [1],
      ];
    const B_SHAPE = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ];
    const K_SHAPE = [
        [1, 1, 1],
        [1, 1, 1],
      ];
    const I_SHAPE = [
      [1],
      [1],
      [1],
      [1],
    ];
    const J_SHAPE = [
      [1, 0, 0],
      [1, 1, 1],
    ];
    const S_SHAPE = [
      [0, 1, 1],
      [1, 1, 0],
    ];
    const Z_SHAPE = [
      [1, 1, 0],
      [0, 1, 1],
    ];

    const ALL_SHAPES = [T_SHAPE, O_SHAPE, L_SHAPE, I_SHAPE, J_SHAPE, S_SHAPE, Z_SHAPE, E_SHAPE, D_SHAPE, B_SHAPE, K_SHAPE];

    function createShapeElement(shape, cellSize, fillColor) {
      const wrapper = document.createElement('div');
      wrapper.className = 'shape-wrapper';
      wrapper.style.position = 'absolute';

      const shapeWidthInCells = Math.max(...shape.map(row => row.length));
      const shapeHeightInCells = shape.length;

      wrapper.style.width = (shapeWidthInCells * cellSize) + 'px';
      wrapper.style.height = (shapeHeightInCells * cellSize) + 'px';
      

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] === 1) {
            const cellDiv = document.createElement('div');
            cellDiv.style.position = 'absolute';
            cellDiv.style.left = (col * cellSize) + 'px';
            cellDiv.style.top = (row * cellSize) + 'px';
            cellDiv.style.width = cellSize + 'px';
            cellDiv.style.height = cellSize + 'px';
            cellDiv.style.backgroundColor = fillColor;
            cellDiv.style.border = '3px ridge rgba(255,255,255,0.5)';
            cellDiv.style.boxSizing = 'border-box';
            cellDiv.style.background = `
            linear-gradient(
                to bottom,
                #3090ff 0%,
                #62b0ff 50%,
                #1f73cc 100%
            )
            `;
            cellDiv.style.boxShadow = `
            inset 0 1px 0 rgba(255,255,255,0.7),
            inset 0 -1px 4px rgba(0,0,0,0.3)
            `;
            cellDiv.style.borderRadius = '4px';

            wrapper.appendChild(cellDiv);
          }
        }
      }

      return wrapper;
    }

    function drawShapeShadow(shapeMatrix, gridX, gridY, fillColor = '#ff4c4c') {
        // gridX, gridY — координаты «ячейки» на сетке
        // Примерно: ctx.fillRect( (gridX+col)*cellSize, (gridY+row)*cellSize, cellSize, cellSize )
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = fillColor;
        for (let row = 0; row < shapeMatrix.length; row++) {
          for (let col = 0; col < shapeMatrix[row].length; col++) {
            if (shapeMatrix[row][col] === 1) {
              const x = (gridX + col) * cellSize;
              const y = (gridY + row) * cellSize;
              if (x >= 0 && y >= 0 && x < gridCount*cellSize && y < gridCount*cellSize) {
                ctx.fillRect(x, y, cellSize, cellSize);
              }
            }
          }
        }
        ctx.restore();
      }

    function getGridCoordsFromMouse(mouseX, mouseY) {
        // mouseX, mouseY — координаты мыши в пикселях canvas
        // переводим в индекс ячейки
        const gx = Math.floor(mouseX / cellSize);
        const gy = Math.floor(mouseY / cellSize);
        return { gx, gy };
      }

    const shapeCont = document.querySelector('.shape-cont');
    let shapeDataArray = []; 

    const screenWidth = window.innerWidth;
    const shapeWidth = cellSize * 0.6; 

    function generateThreeShapes() {
        function rotateMatrixCW(matrix) {
            const rows = matrix.length;
            const cols = matrix[0].length;
            const rotated = [];
        
            for (let c = 0; c < cols; c++) {
              const newRow = [];
              for (let r = rows - 1; r >= 0; r--) {
                newRow.push(matrix[r][c]);
              }
              rotated.push(newRow);
            }
            return rotated;
          }
        
          // Отражение по горизонтали (зеркало слева-направо)
          function flipMatrixH(matrix) {
            // Для каждой строки делаем reverse()
            return matrix.map(row => row.slice().reverse());
          }

        const newShapes = [];
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * ALL_SHAPES.length);
          let shapeMatrix = ALL_SHAPES[randomIndex];
          const rotations = Math.floor(Math.random() * 4);

          for (let r = 0; r < rotations; r++) {
            shapeMatrix = rotateMatrixCW(shapeMatrix);
          }

            // 3) 50% шанс отразить фигуру по горизонтали
          if (Math.random() < 0.5) {
            shapeMatrix = flipMatrixH(shapeMatrix);
          }

          const shapeEl = createShapeElement(shapeMatrix, cellSize * 0.6, "#ff4c4c");
    
          const startLeft = (screenWidth / 2) - (shapeWidth / 2) + (i * shapeWidth * 5) - (shapeWidth * 5);
          const startTop = 50;

          shapeEl.style.left = startLeft + 'px';
          shapeEl.style.top  = startTop  + 'px';
          shapeCont.appendChild(shapeEl);
    
          newShapes.push({
            shapeMatrix,
            domEl: shapeEl,
            color: '#ff4c4c',
            isDragging: false,
            offsetX: 0,
            offsetY: 0,
            // Начальные координаты
            initialLeft: startLeft,
            initialTop:  startTop,
          });
        }

        checkIfGameOver();

        // Подключаем им drag'n'drop
        newShapes.forEach(s => makeDraggable(s));
        shapeDataArray.push(...newShapes);
    }
    
    generateThreeShapes();

    //Drag and drop

function makeDraggable(shapeData) {
  const element = shapeData.domEl;

  // Поддержка Pointer Events:
  // - pointerdown (аналог mousedown / touchstart)
  // - pointermove (аналог mousemove / touchmove)
  // - pointerup   (аналог mouseup   / touchend)

  function onPointerDown(e) {
    if (gameOver) return;
    // e.preventDefault(); // если нужно предотвращать контекст-меню или скролл

    shapeData.isDragging = true;
    shapeData.offsetX = e.clientX - element.offsetLeft;
    shapeData.offsetY = e.clientY - element.offsetTop;
    element.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (gameOver) return;
    if (!shapeData.isDragging) return;

    // e.preventDefault(); // при необходимости
    const newX = e.clientX - shapeData.offsetX;
    const newY = e.clientY - shapeData.offsetY;
    element.style.left = newX + 'px';
    element.style.top  = newY + 'px';

    // Рисуем тень
    renderEmptyBoard();
    const mouseCanvasX = e.clientX - canvasRect.left - shapeData.offsetX;
    const mouseCanvasY = e.clientY - canvasRect.top  - shapeData.offsetY;
    const { gx, gy } = getGridCoordsFromMouse(mouseCanvasX, mouseCanvasY);
    drawShapeShadow(shapeData.shapeMatrix, gx, gy, shapeData.color);
  }

  function onPointerUp(e) {
    if (gameOver) return;
    if (!shapeData.isDragging) return;

    shapeData.isDragging = false;
    element.style.cursor = 'grab';

    const boardX = e.clientX - canvasRect.left - shapeData.offsetX;
    const boardY = e.clientY - canvasRect.top  - shapeData.offsetY;
    const gx = Math.floor(boardX / cellSize);
    const gy = Math.floor(boardY / cellSize);

    if (!canPlace(shapeData.shapeMatrix, gx, gy)) {
      console.log("Cannot place – revert to initial position!");
      element.style.left = shapeData.initialLeft + 'px';
      element.style.top  = shapeData.initialTop  + 'px';
      drawGrid();
      return;
    }

    // Устанавливаем фигуру
    for (let row = 0; row < shapeData.shapeMatrix.length; row++) {
      for (let col = 0; col < shapeData.shapeMatrix[row].length; col++) {
        if (shapeData.shapeMatrix[row][col] === 1) {
          board[gy + row][gx + col] = 1;
        }
      }
    }

    element.remove();
    shapeDataArray = shapeDataArray.filter(s => s !== shapeData);

    clearLines();
    renderEmptyBoard();
    checkIfGameOver();

        if (shapeDataArray.length === 0) {
        console.log("All shapes placed. Generating new shapes...");
        generateThreeShapes();
        }
    }

    // Подключаем Pointer Events
    element.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    }

      function canPlace(shapeMatrix, gx, gy) {
        for (let row = 0; row < shapeMatrix.length; row++) {
          for (let col = 0; col < shapeMatrix[row].length; col++) {
            if (shapeMatrix[row][col] === 1) {
              const boardRow = gy + row;
              const boardCol = gx + col;
              // Выходим ли за границы?
              if (boardRow < 0 || boardRow >= gridCount ||
                  boardCol < 0 || boardCol >= gridCount) {
                return false;
              }
              // Или там уже занято?
              if (board[boardRow][boardCol] === 1) {
                return false;
              }
            }
          }
        }
        return true;
      }
    
      // === 9) clearLines() — убираем заполненные ряды/колонки
      function clearLines() {
        // 1) Удаляем заполненные строки (без анимации)
        for (let row = 0; row < gridCount; row++) {
          const isFullRow = board[row].every(cell => cell === 1);
          if (isFullRow) {
            board[row] = board[row].map(() => 0);
            console.log(`Row ${row} cleared!`);
            score.textContent = Number(score.textContent) + 5;
          }
        }
      
        // 2) Ищем заполненные столбцы
        for (let col = 0; col < gridCount; col++) {
          let isFullCol = true;
          for (let row = 0; row < gridCount; row++) {
            if (board[row][col] === 0) {
              isFullCol = false;
              break;
            }
          }
          if (isFullCol) {
            // (a) Сразу обнулим этот столбец в board, 
            //     чтобы он не рисовался при обычной перерисовке.
            for (let row = 0; row < gridCount; row++) {
              board[row][col] = 0;
            }
            console.log(`Column ${col} cleared!`);
            score.textContent = Number(score.textContent) + 5;
      
            // (b) Запускаем «анимацию рассыпания»
            explodeColumn(col);
          }
        }
        // После мы просто перерисовываем
        renderEmptyBoard();
      }

      function canPlaceAnywhere(shapeMatrix) {
        for (let row = 0; row < gridCount; row++) {
          for (let col = 0; col < gridCount; col++) {
            if (canPlace(shapeMatrix, col, row)) {
              return true;
            }
          }
        }
        return false;
      }

      function checkIfGameOver() {
        // Если shapeDataArray пустой — возможно, наоборот, вы хотите сгенерировать новые 
        // фигуры (как у вас уже сделано). Или пропустить
        if (shapeDataArray.length === 0) {
          // нет фигур для проверки – значит, пока не «Game Over».
          // (Или наоборот, вы хотите сразу выдать "All placed, next wave"?)
          return;
        }
      
        // Проверяем, может ли хоть одна фигура поместиться
        let canAnyShapeBePlaced = false;
        for (const shapeData of shapeDataArray) {
          if (canPlaceAnywhere(shapeData.shapeMatrix)) {
            // Нашли фигуру, которую можно поставить
            canAnyShapeBePlaced = true;
            break;
          }
        }
      
        if (!canAnyShapeBePlaced) {
          console.log("GAME OVER: No space for the remaining figures!");
          alert("GAME OVER: No space for the remaining figures!");
          gameOver = true;
        }
      }

      function drawCell(row, col) {
        const x = col * cellSize;
        const y = row * cellSize;
        ctx.fillStyle = "#ff4c4c";
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }

      function explodeColumn(colIndex) {
        // 1) Соберём массив «частиц»
        const particles = [];
      
        // Пройдём по строкам
        for (let row = 0; row < gridCount; row++) {
          // Если раньше клетка была `1` (то есть заполнена), 
          // мы её «разобьём» на несколько мелких квадратиков.
          // Но мы уже обнулили board[row][colIndex], поэтому 
          // здесь можно просто генерировать частицы для каждой клетки столбца.
          // (Если хотите проверять, что действительно была 1, 
          //  тогда перед обнулением сохраните эти ячейки.)
          
          // Координаты верхнего левого угла клетки
          const cellX = colIndex * cellSize;
          const cellY = row * cellSize;
      
          // Количество маленьких квадратиков на одну клетку
          const numFragments = 4; 
          // Сколько по горизонтали/вертикали (примерно sqrt(numFragments)) 
          // — упрощенно сделаем просто цикл
      
          for (let i = 0; i < numFragments; i++) {
            // Ширина/высота каждого квадратика
            const fragSize = cellSize / 2; 
            // Начальные координаты (дробим клетку на 4 части 2x2)
            const offsetX = (i % 2) * fragSize;
            const offsetY = (Math.floor(i / 2)) * fragSize;
      
            const px = cellX + offsetX;
            const py = cellY + offsetY;
      
            // Случайная скорость
            // пусть разлетаются в стороны, 
            // с небольшим разбросом по вертикали
            const vx = (Math.random() - 0.5) * 5; 
            const vy = - (Math.random() * 5 + 2);  // пусть летят немного вверх
      
            // Записываем в массив
            particles.push({
              x: px,
              y: py,
              w: fragSize,
              h: fragSize,
              vx,
              vy,
              alpha: 1.0,           // начальная непрозрачность
              alphaDecay: 0.02,     // как быстро «тает» прозрачность
            });
          }
        }
      
        // 2) Запускаем анимационный цикл
        const pulses = [];

        function createMultiplePulses(x, width, count = 3) {
            for (let i = 0; i < count; i++) {
              pulses.push({
                x: x,
                y: 0,
                width: width,
                height: canvas.height,
                alpha: 1,
                // например, у каждого волны своя скорость затухания
                alphaDecay: 0.02 + i * 0.01,  
              });
            }
          }
        const gravity = 0.2; // гравитация, пусть тянет вниз
        //createMultiplePulses(colIndex * cellSize, cellSize);
        function animateParticles() {
          // Очищаем канвас и рисуем сетку + остальное
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawGrid();
      
          // Рисуем оставшиеся клетки board (столбец уже обнулён)
          for (let r = 0; r < gridCount; r++) {
            for (let c = 0; c < gridCount; c++) {
              if (board[r][c] === 1) {
                drawCell(r, c);
              }
            }
          }
      
          // Обновляем и рисуем частицы
          let aliveCount = 0;
          particles.forEach(p => {
            // Сдвиг с учётом скорости
            p.x += p.vx;
            p.y += p.vy;
            // Применяем гравитацию
            p.vy += gravity;
      
            // Уменьшаем прозрачность
            p.alpha -= p.alphaDecay;
            if (p.alpha < 0) p.alpha = 0;
      
            // Рисуем, если alpha > 0
            if (p.alpha > 0) {
              aliveCount++;
              ctx.save();
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = "#ff4c4c";
              ctx.fillRect(p.x, p.y, p.w, p.h);
      
              // обводка, если хотите
              ctx.strokeStyle = "rgba(255,255,255,0.5)";
              ctx.lineWidth = 1;
              ctx.strokeRect(p.x, p.y, p.w, p.h);
      
              ctx.restore();
            }
          });
        
          pulses.forEach((pulse, index) => {
            pulse.width += 1;
            pulse.alpha -= pulse.alphaDecay;
            if (pulse.alpha > 0) {
              ctx.save();
              ctx.globalAlpha = pulse.alpha;
              // Можем добавить градиент:
              const gradient = ctx.createLinearGradient(pulse.x, 0, pulse.x + pulse.width, 0);
              gradient.addColorStop(0, '#62b0ff');
              gradient.addColorStop(0.5, '#3090ff');
              gradient.addColorStop(1, '#1f73cc');
        
              ctx.fillStyle = gradient;
              ctx.fillRect(pulse.x, pulse.y, pulse.width, pulse.height);
              ctx.restore();
            } else {
              pulses.splice(index, 1);
            }
          });
          
          const isPulsesAlive = (pulses.length > 0);
          if (aliveCount > 0 || pulses.length > 0) {
            requestAnimationFrame(animateParticles);
          } else {
            console.log("Column exploded completely!");
          }
        }
      
        requestAnimationFrame(animateParticles);
      }
    });
