document.addEventListener("DOMContentLoaded", () => {
    
    // Lista exacta de las regiones que hemos dibujado en el HTML
    const regions = [
        { id: 'galicia', name: 'Galicia' },
        { id: 'asturias', name: 'Principado de Asturias' },
        { id: 'cantabria', name: 'Cantabria' },
        { id: 'paisvasco', name: 'País Vasco' },
        { id: 'navarra', name: 'Comunidad Foral de Navarra' },
        { id: 'aragon', name: 'Aragón' },
        { id: 'cataluna', name: 'Cataluña' },
        { id: 'castillayleon', name: 'Castilla y León' },
        { id: 'larioja', name: 'La Rioja' },
        { id: 'madrid', name: 'Comunidad de Madrid' },
        { id: 'extremadura', name: 'Extremadura' },
        { id: 'castillalamancha', name: 'Castilla-La Mancha' },
        { id: 'valencia', name: 'Comunidad Valenciana' },
        { id: 'murcia', name: 'Región de Murcia' },
        { id: 'andalucia', name: 'Andalucía' }
        // Nota: Baleares y Canarias están simplificadas en el mapa, 
        // puedes añadirlas aquí si quieres que el juego pregunte por ellas.
    ];

    let currentTarget = null;
    let score = 0;
    const scoreEl = document.getElementById('score');
    const targetEl = document.getElementById('target-region');
    const feedbackEl = document.getElementById('feedback-message');

    // 1. Elegir una región al azar
    function pickNewMission() {
        const randomIndex = Math.floor(Math.random() * regions.length);
        currentTarget = regions[randomIndex];
        targetEl.textContent = currentTarget.name;
        feedbackEl.textContent = "";
        
        // Limpiar estilos anteriores (rojo/verde)
        document.querySelectorAll('.region').forEach(el => {
            el.classList.remove('wrong', 'correct');
        });
    }

    // 2. Manejar el clic
    document.querySelectorAll('.region').forEach(path => {
        path.addEventListener('click', (e) => {
            const clickedId = e.target.id;

            if (clickedId === currentTarget.id) {
                // ACIERTO
                e.target.classList.add('correct');
                score += 10;
                scoreEl.textContent = score;
                feedbackEl.textContent = "¡Muy bien! 🎉";
                feedbackEl.style.color = "green";
                
                // Siguiente nivel tras 1.5 segundos
                setTimeout(pickNewMission, 1500);
            } else {
                // ERROR
                e.target.classList.add('wrong');
                feedbackEl.textContent = "¡Uy! Esa no es " + currentTarget.name;
                feedbackEl.style.color = "red";
            }
        });
    });

    // Iniciar juego al cargar
    pickNewMission();
});