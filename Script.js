

const flechaIzquierda = document.getElementById('flecha-izquierda');
const flechaDerecha = document.getElementById('flecha-derecha');
const imagenes = document.querySelectorAll('.carrusel-imagen');
let indiceActual = 0;

function mostrarImagen(indice) {
    imagenes.forEach((img, index) => {
        img.classList.remove('active'); // Oculta todas las imágenes
        if (index = indice) {
            img.classList.add('active'); // Muestra la imagen actual
        }
    });
}

flechaDerecha.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % imagenes.length; // Incrementa el índice
    mostrarImagen(indiceActual);
});

flechaIzquierda.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length; // Decrementa el índice
    mostrarImagen(indiceActual);
});

// Mostrar la primera imagen al cargar
mostrarImagen(indiceActual);

// Función para mostrar mensajes
function showMessage(message, isError = false) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message;

    // Aplicar clase de error o información
    if (isError) {
        messageContainer.classList.add('error-message');
        messageContainer.classList.remove('info-message');
    } else {
        messageContainer.classList.add('info-message');
        messageContainer.classList.remove('error-message');
    }

    messageContainer.style.display = 'block'; 

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}


// Playlist

document.getElementById('add-song').addEventListener('click', function() {
    const newSongUrl = document.getElementById('new-song-url').value.trim(); 
    const newSongTitle = document.getElementById('new-song-title').value.trim(); 

    if (newSongUrl && newSongTitle) {
        // Agregar la canción a la lista 
        addSongToList({ title: newSongTitle, url: newSongUrl });

        // Enviar la nueva canción a la API
        fetch('/api/songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newSongTitle, url: newSongUrl })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar la canción');
            }
            return response.json();
        })
        .then(data => {
            console.log('Canción guardada:', data);
            showMessage("Canción agregada con éxito", false, "#ff00ff", 6000); 
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage("No se pudo guardar la canción. Inténtalo de nuevo.", true);
        });

        // Abrir la URL en una nueva pestaña
        window.open(newSongUrl, '_blank');

        // Limpiar los campos de entrada
        document.getElementById('new-song-url').value = ''; // Limpiar el campo de entrada
        document.getElementById('new-song-title').value = ''; // Limpiar el campo de título
    } else {
        showMessage("Por favor, completa todos los campos.", true); 
    }
});

//  agregar canción a la lista 
function addSongToList(song) {
    const songList = document.getElementById('song-list');
    const newSongItem = document.createElement('li');
    newSongItem.innerHTML = `<a class="dropdown-item play-song" href="${song.url}" target="_blank" style="color: #007bff;">${song.title}</a>`;
    
    songList.appendChild(newSongItem);
}


// Cargar canciones existentes al iniciar la página.
fetch('/api/songs')
.then(response => response.json())
.then(songs => {
    songs.forEach(song => addSongToList(song));
})
.catch(error => console.error('Error:', error));

// Manejar clics en las canciones predefinidas
document.querySelectorAll('.play-song').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar redirección
        
        const audioPlayer = document.getElementById('audio-player');
        
        audioPlayer.src = this.getAttribute('href'); 

        
        audioPlayer.play().catch(error => {
            console.error("Error al intentar reproducir:", error);
            showMessage("No se pudo reproducir la canción. Verifica la URL.", true); 
        });
        
        audioPlayer.style.display = 'block'; // Muestra el reproductor
    });
});

// contactame

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío por defecto del formulario

        // Obtener y limpiar los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const celular = document.getElementById('celular').value.trim(); 
        const correoElectronico = document.getElementById('correo_electronico').value.trim();
        const fechaContacto = document.getElementById('fecha_contacto').value; 
        const horaContacto = document.getElementById('hora_contacto').value; 

        // Validar que los campos requeridos no estén vacíos
        if (!nombre || !asunto || !correoElectronico || !fechaContacto || !horaContacto) {
            showMessage("Por favor, completa todos los campos requeridos.", true);
            return; 
        }


        // Crear un objeto con los datos del formulario 
        const contactData = {
            nombre,
            asunto,
            celular,
            correo_electronico: correoElectronico,
            fecha_contacto: fechaContacto,
            hora_contacto: horaContacto 
        };

        // Api
        fetch('/api/contactos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar el contacto');
            }
            return response.json();
        })
        .then(data => {
            console.log('Contacto guardado:', data); 

            // Limpiar el formulario
            document.getElementById('contactForm').reset();
            
            showMessage("Contacto enviado con éxito.", false);
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage("No se pudo enviar el contacto. Inténtalo de nuevo.", true);
        });
    });
});

    