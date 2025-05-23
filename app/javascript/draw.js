document.addEventListener('DOMContentLoaded', function() {
    // ========== SELECTORS ========== //
    const canvas = document.getElementById('pixelCanvas');
    const ctx = canvas.getContext('2d');
    const gridForm = document.getElementById('grid');
    const canvasForm = document.getElementById('canvas');
    const gridSizeInput = document.getElementById('gridSize');
    const canvasSizeInput = document.getElementById('canvasSize');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const colorPicker = document.getElementById('colorPicker');
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const applyBgColorBtn = document.getElementById('applyBgColor');
    const eraserBtn = document.getElementById('eraser');
    const clearCanvasBtn = document.getElementById('clearCanvas');
    const toggleGridBtn = document.getElementById('toggleGrid');
    const saveDrawingBtn = document.getElementById('saveDrawing');
    const uploadDrawingBtn = document.getElementById('uploadDrawing');
    const usedColorsContainer = document.getElementById('usedColorsContainer');

    // ========== STATE VARIABLES ========== //
    let currentColor = colorPicker.value;
    let isDrawing = false;
    let isErasing = false;
    let showGrid = true;
    let chessMode = false;
    let cellSize = 0;
    let usedColors = [];
    let canvasData = [];

    // Initialize with default values
    canvasSizeInput.value = 400;
    gridSizeInput.value = 20;

    // ========== CANVAS FUNCTIONS ========== //
    
    function initCanvas() {
        const size = parseInt(canvasSizeInput.value);
        canvas.width = size;
        canvas.height = size;
        updateGrid();
    }

    function updateGrid() {
        const gridSize = parseInt(gridSizeInput.value);
        cellSize = canvas.width / gridSize;
        initializeCanvasData();
        drawCanvas();
    }

    function initializeCanvasData() {
        const gridSize = parseInt(gridSizeInput.value);
        canvasData = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
    }

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (chessMode) {
            drawChessBackground();
        } else {
            ctx.fillStyle = bgColorPicker.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        redrawPixels();
        
        if (showGrid) {
            drawGridLines();
        }
    }

    function drawGridLines() {
        const gridSize = parseInt(gridSizeInput.value);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;

        for (let i = 0; i <= gridSize; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }
    }

    function drawChessBackground() {
        const gridSize = parseInt(gridSizeInput.value);
        const color1 = color1Input.value;
        const color2 = color2Input.value;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const color = (x + y) % 2 === 0 ? color1 : color2;
                ctx.fillStyle = color;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                canvasData[y][x] = color;
            }
        }
    }

    function redrawPixels() {
        const gridSize = parseInt(gridSizeInput.value);
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (canvasData[y][x] && !chessMode) {
                    ctx.fillStyle = canvasData[y][x];
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    // ========== DRAWING FUNCTIONS ========== //
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const gridSize = parseInt(gridSizeInput.value);
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
            const color = isErasing ? 
                (chessMode ? ((x + y) % 2 === 0 ? color1Input.value : color2Input.value) : bgColorPicker.value) 
                : currentColor;
            
            ctx.fillStyle = color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            canvasData[y][x] = isErasing ? null : color;
            
            if (showGrid) {
                ctx.strokeStyle = '#ddd';
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            
            if (!isErasing && !usedColors.includes(currentColor)) {
                addToUsedColors(currentColor);
            }
        }
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // ========== TOOL FUNCTIONS ========== //
    function applyBackgroundColor() {
        chessMode = false;
        drawCanvas();
    }

    function updateChessBoard() {
        chessMode = true;
        drawCanvas();
    }

    function toggleEraser() {
        isErasing = !isErasing;
        eraserBtn.classList.toggle('active', isErasing);
        eraserBtn.textContent = isErasing ? "Erasing" : "Eraser";
    }

    function toggleGridVisibility() {
        showGrid = !showGrid;
        toggleGridBtn.textContent = showGrid ? 'Hide Grid' : 'Show Grid';
        drawCanvas();
    }

    function clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            initializeCanvasData();
            drawCanvas();
        }
    }

    // ========== COLOR FUNCTIONS ========== //
    function addToUsedColors(color) {
        // Remove color if it already exists
        usedColors = usedColors.filter(c => c !== color);
        
        // Add to beginning of array
        usedColors.unshift(color);
        
        // Limit to 5 colors
        if (usedColors.length > 5) {
            usedColors.pop();
        }
        
        updateUsedColorsDisplay();
    }

    function updateUsedColorsDisplay() {
        usedColorsContainer.innerHTML = '';
        
        usedColors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-swatch';
            colorBox.style.backgroundColor = color;
            colorBox.title = color;
            colorBox.dataset.color = color;
            
            colorBox.addEventListener('click', function() {
                colorPicker.value = color;
                currentColor = color;
                isErasing = false;
                eraserBtn.classList.remove('active');
                eraserBtn.textContent = "Eraser";
            });
            
            usedColorsContainer.appendChild(colorBox);
        });
    }

    // ========== SAVE/EXPORT FUNCTIONS ========== //
    function saveDrawing() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw background
        if (chessMode) {
            drawChessBackgroundOnCanvas(tempCtx);
        } else {
            tempCtx.fillStyle = bgColorPicker.value;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        }
        
        // Draw pixels
        const gridSize = parseInt(gridSizeInput.value);
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (canvasData[y][x] && !chessMode) {
                    tempCtx.fillStyle = canvasData[y][x];
                    tempCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        
        // Create download
        const link = document.createElement('a');
        link.download = 'pixel-art-' + new Date().toISOString().slice(0, 10) + '.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }
    
    function uploadDrawing() {
        // Create a temporary canvas to get the image data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw background
        if (chessMode) {
            drawChessBackgroundOnCanvas(tempCtx);
        } else {
            tempCtx.fillStyle = bgColorPicker.value;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        }
        
        // Draw pixels
        const gridSize = parseInt(gridSizeInput.value);
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (canvasData[y][x] && !chessMode) {
                    tempCtx.fillStyle = canvasData[y][x];
                    tempCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        
        // Get the image data
        const imageData = tempCanvas.toDataURL('image/png');
        
        // Show the form and populate the fields
        const formContainer = document.getElementById('post-form-container');
        const form = formContainer.querySelector('form');
        
        // Set the drawing data in the hidden field
        form.querySelector('#post_drawing_data').value = imageData;
        
        // Create a preview of the drawing
        const previewDiv = form.querySelector('#drawing-preview');
        previewDiv.innerHTML = '<h4>Your Drawing Preview:</h4>';
        const previewImg = document.createElement('img');
        previewImg.src = imageData;
        previewImg.style.maxWidth = '200px';
        previewDiv.appendChild(previewImg);
        
        // Show the form
        formContainer.style.display = 'block';
        
        // Scroll to the form
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
    function drawChessBackgroundOnCanvas(context) {
        const gridSize = parseInt(gridSizeInput.value);
        const color1 = color1Input.value;
        const color2 = color2Input.value;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                context.fillStyle = (x + y) % 2 === 0 ? color1 : color2;
                context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }

    // ========== EVENT LISTENERS ========== //
    function setupEventListeners() {
        // Canvas events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Form submissions
        gridForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateGrid();
        });
        
        canvasForm.addEventListener('submit', (e) => {
            e.preventDefault();
            initCanvas();
        });
        
        // Color and tool controls
        colorPicker.addEventListener('input', (e) => {
            currentColor = e.target.value;
            isErasing = false;
            eraserBtn.classList.remove('active');
            eraserBtn.textContent = "Eraser";
        });
        
        applyBgColorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyBackgroundColor();
        });
        
        color1Input.addEventListener('input', updateChessBoard);
        color2Input.addEventListener('input', updateChessBoard);
        
        eraserBtn.addEventListener('click', toggleEraser);
        clearCanvasBtn.addEventListener('click', clearCanvas);
        toggleGridBtn.addEventListener('click', toggleGridVisibility);
        saveDrawingBtn.addEventListener('click', saveDrawing);
        uploadDrawingBtn.addEventListener('click', uploadDrawing);
    }

    // Initialize the app
    setupEventListeners();
    initCanvas();
});