const form = document.getElementById('form'),
lista = document.getElementById('lista'),
input = document.getElementById('input'),
template = document.getElementById('template').content,
fragment = document.createDocumentFragment();
let tareas = {}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    crearTarea();
});

lista.addEventListener('click', e => {
    btnAccion(e);
});

form.addEventListener('submit' , e => {
    e.preventDefault();
    agregarTarea(e);
});

const agregarTarea = e => {
    if (input.value.trim() === '') {
        return
    }

    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    }
    tareas[tarea.id] = tarea;
    
    form.reset();
    input.focus();
    crearTarea();
}

const crearTarea = () => {

    localStorage.setItem('tareas', JSON.stringify(tareas));

    if (Object.values(tareas).length === 0) {
        lista.innerHTML = `
            <div class="alert alert-dark text-center">
                No hay tareas pendientes
            </div>
        `;
        return
    }

    lista.innerHTML = '';
    Object.values(tareas).forEach(tarea => {
        const clone = template.cloneNode(true)
        clone.querySelector('.alert').style.animation = 'fadeIn .6s ease alternate';
        clone.querySelector('p').textContent = tarea.texto;

        if (tarea.estado) { 
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary');
            clone.querySelectorAll('.btn')[0].src = 'img/refresh.svg';
            clone.querySelectorAll('.btn')[0].classList.add('btnrefresh')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        clone.querySelectorAll('.btn')[0].dataset.id = tarea.id;
        clone.querySelectorAll('.btn')[1].dataset.id = tarea.id;
        fragment.appendChild(clone)
    });
    lista.appendChild(fragment)
}

const btnAccion = (e) => {
    if (e.target.classList.contains('btncheck')) {
        tareas[e.target.dataset.id].estado = true;
        crearTarea();
    }

    if (e.target.classList.contains('btntrash')) {
        delete tareas[e.target.dataset.id];
        crearTarea();
    }

    if (e.target.classList.contains('btnrefresh')) {
        tareas[e.target.dataset.id].estado = false;
        crearTarea();
    }

    e.stopPropagation();
}