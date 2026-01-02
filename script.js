document.addEventListener("DOMContentLoaded", () => {

    // 1. DATOS DEL MAPA (Tus datos originales)
    const regions = [
        // ... (Pega aquí tu lista GIGANTE de regions que ya tenías) ...
        // Asegúrate de que no falte ninguna coma ni corchete.
        // Por brevedad, asumo que copias tu lista 'const regions = [...]' aquí.
    ];
    
    // --- IMPORTANTE: Si no copias la lista de regions aquí dentro, el mapa no saldrá ---
    // Si ya tienes el archivo script.js, simplemente reemplaza las funciones de abajo 
    // y la lista 'communities', pero NO borres tu lista 'regions'.


    // 2. PALETA DE COLORES (Uno diferente para cada comunidad)
    const communityColors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33F6", "#33FFF6", 
        "#F6FF33", "#FF8C33", "#8C33FF", "#33FF8C", "#FF3333",
        "#33A1FF", "#A133FF", "#FF3380", "#33FF99", "#FFA833",
        "#3366FF", "#FF3366", "#66FF33", "#9933FF", "#581845"
    ];

    // 3. COMUNIDADES (Corregidos los nombres para coincidir con regions)
    // He cambiado espacios por guiones bajos donde era necesario (santa_cruz, las_palmas)
    const communities = [
        { name: "Galicia", ids: ["la coruña", "lugo", "ourense", "pontevedra"] },
        { name: "Asturias", ids: ["asturias"] },
        { name: "Cantabria", ids: ["cantabria"] },
        { name: "País Vasco", ids: ["vizcaya", "guipuzcoa", "álava"] }, 
        { name: "Navarra", ids: ["navarra"] },
        { name: "La Rioja", ids: ["la rioja"] },
        { name: "Aragón", ids: ["huesca", "zaragoza", "teruel"] },
        { name: "Cataluña", ids: ["lleida", "girona", "barcelona", "tarragona"] },
        { name: "Castilla y León", ids: ["leon", "palencia", "burgos", "zamora", "valladolid", "soria", "salamanca", "avila", "segovia"] },
        { name: "Madrid", ids: ["madrid"] },
        { name: "Castilla-La Mancha", ids: ["guadalajara", "cuenca", "toledo", "ciudad real", "albacete"] },
        { name: "C. Valenciana", ids: ["castellon", "valencia", "alicante"] },
        { name: "Murcia", ids: ["murcia"] },
        { name: "Extremadura", ids: ["caceres", "badajoz"] },
        { name: "Andalucía", ids: ["huelva", "sevilla", "cordoba", "jaen", "cadiz", "malaga", "granada", "almeria"] },
        { name: "Islas Baleares", ids: ["islas baleares"] }, 
        // CORREGIDO: IDs coinciden con regions
        { name: "Canarias", ids: ["santa_cruz", "las_palmas"] }, 
        { name: "Ceuta y Melilla", ids: ["ceuta", "melilla"] }
    ];

    // ELEMENTOS DEL DOM
    const svg = document.getElementById('spain-svg'); 
    const scoreEl = document.getElementById('score');
    const targetEl = document.getElementById('target-region');
    const feedbackEl = document.getElementById('feedback-message');
    const titleElement = document.getElementById('game-title');

    // ESTADO DEL JUEGO
    let currentTarget = null;
    let score = 0;
    let canClick = true;
    let gameMode = 'provincias'; // 'provincias' o 'comunidades'

    // --- FUNCIÓN DIBUJAR MAPA ---
    function drawMap() {
        svg.innerHTML = ''; // Limpiar mapa previo

        // 1. Dibujar el cuadro punteado para Canarias (fondo)
        const box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        box.setAttribute("x", "10");
        box.setAttribute("y", "280");
        box.setAttribute("width", "160");
        box.setAttribute("height", "100");
        box.setAttribute("class", "inset-box");
        svg.appendChild(box);

        // 2. Dibujar Regiones
        regions.forEach(reg => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", reg.path);
            path.setAttribute("id", reg.id);
            path.setAttribute("class", "region");

            // MOVIMIENTO DE CANARIAS A LA IZQUIERDA
            if (reg.id === "santa_cruz" || reg.id === "las_palmas") {
                // translate(x, y): Restar X mueve a izquierda, Sumar Y mueve abajo
                path.setAttribute("transform", "translate(-280, 60)"); 
            }

            // Eventos
            path.addEventListener('click', handleSelection);
            
            // Hover especial para comunidades
            path.addEventListener('mouseover', (e) => {
                if (gameMode === 'comunidades') highlightCommunity(e.target.id, true);
            });
            path.addEventListener('mouseout', (e) => {
                if (gameMode === 'comunidades') highlightCommunity(e.target.id, false);
            });

            svg.appendChild(path);
        });
    }

    // --- FUNCIÓN RESALTAR GRUPO ---
    function highlightCommunity(provId, isHovering) {
        const comm = communities.find(c => c.ids.includes(provId));
        if (comm) {
            comm.ids.forEach(id => {
                const el = document.getElementById(id);
                // Solo iluminar si no está ya acertada
                if (el && !el.classList.contains('correct')) {
                    if (isHovering) el.classList.add('community-hover');
                    else el.classList.remove('community-hover');
                }
            });
        }
    }

    // --- LÓGICA DEL CLIC ---
    function handleSelection(e) {
        if (!canClick) return;
        const clickedId = e.target.id;
        let isCorrect = false;

        // Comprobar acierto
        if (gameMode === 'provincias') {
            if (clickedId === currentTarget.id) isCorrect = true;
        } else {
            if (currentTarget.ids.includes(clickedId)) isCorrect = true;
        }

        if (isCorrect) {
            // ACIERTO
            canClick = false;
            score += 10;
            scoreEl.textContent = score;
            feedbackEl.textContent = "¡MUY BIEN! 🎉";
            feedbackEl.style.color = "green";

            // Buscar índice para el color
            let commIndex = -1;
            if (gameMode === 'provincias') {
                // En modo provincias, buscamos a qué comunidad pertenece la provincia objetivo
                commIndex = communities.findIndex(c => c.ids.includes(currentTarget.id));
            } else {
                // En modo comunidades, buscamos por nombre
                commIndex = communities.findIndex(c => c.name === currentTarget.name);
            }

            // Asignar color único
            const color = (commIndex !== -1) ? communityColors[commIndex % communityColors.length] : "#2ecc71";

            if (gameMode === 'provincias') {
                const el = document.getElementById(clickedId);
                el.classList.add('correct');
                el.style.fill = color; // Pintamos la provincia
            } else {
                // Pintamos TODA la comunidad
                currentTarget.ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.classList.add('correct');
                        el.classList.remove('community-hover');
                        el.style.fill = color;
                    }
                });
            }

            setTimeout(pickNewMission, 1500);

        } else {
            // FALLO
            e.target.classList.add('wrong');
            feedbackEl.textContent = "¡Ups! Intenta de nuevo.";
            feedbackEl.style.color = "#ff4757";
            setTimeout(() => e.target.classList.remove('wrong'), 1000);
        }
    }

    // --- NUEVA MISIÓN ---
    function pickNewMission() {
        let remaining = [];

        if (gameMode === 'provincias') {
            remaining = regions.filter(r => {
                const el = document.getElementById(r.id);
                return el && !el.classList.contains('correct');
            });
        } else {
            remaining = communities.filter(c => {
                // La comunidad falta si ALGUNA de sus provincias no está verde
                return c.ids.some(id => {
                    const el = document.getElementById(id);
                    return el && !el.classList.contains('correct');
                });
            });
        }

        if (remaining.length === 0) {
            feedbackEl.textContent = "¡FELICIDADES! ¡MAPA COMPLETADO! 🏆";
            feedbackEl.style.color = "gold";
            targetEl.textContent = "FIN";
            return;
        }

        const randomIndex = Math.floor(Math.random() * remaining.length);
        currentTarget = remaining[randomIndex];
        targetEl.textContent = currentTarget.name.toUpperCase();
        feedbackEl.textContent = "";
        canClick = true;
    }

    // --- INICIAR JUEGO (GLOBAL) ---
    window.startGame = function(mode) {
        gameMode = mode;
        document.getElementById('home-menu').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        // Título dinámico
        titleElement.textContent = (mode === 'comunidades') 
            ? "¡Encuentra la Comunidad!" 
            : "¡Encuentra la Provincia!";

        score = 0;
        scoreEl.textContent = 0;

        // Limpiar mapa
        document.querySelectorAll('.region').forEach(el => {
            el.classList.remove('correct', 'wrong', 'community-hover');
            el.style.fill = "";
        });

        pickNewMission();
    };

    // Dibujar mapa al inicio
    drawMap();

}); // FIN DOMContentLoaded

// --- FUNCIÓN VOLVER (Fuera del evento de carga) ---
window.goBack = function() {
    document.getElementById('game-screen').style.display = 'none';
    
    // Restaurar el display correcto del menú (flex o block según tu CSS)
    const menu = document.getElementById('home-menu');
    menu.style.display = 'flex'; // Usamos flex para centrarlo si usas el CSS nuevo
};