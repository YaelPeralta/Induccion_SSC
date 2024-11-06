class Tarea {
    constructor(nombre) {
        this.indice = 0;
        this.nombre = nombre;
        this.siguiente = null;
        this.anterior = null;
    }
}

class ListaTareas {
    constructor() {
        this.primero = null;
        this.ultimo = null;
    }

    Ingresar(nuevaTarea) {
        if (nuevaTarea.nombre == "") {
            return null;
        } else {
            if (this.primero == null) {
                this.primero = nuevaTarea;
                this.ultimo = nuevaTarea;
            } else {
                let aux = this.ultimo;
                aux.siguiente = nuevaTarea;
                nuevaTarea.anterior = aux;
                this.ultimo = nuevaTarea;
            }
            this.guardarEnLocalStorage();
            return nuevaTarea;
        }
    }

    Listar() {
        let aux = this.primero;
        let contador = 0;
        let res = "<table><tr><th> No. Tarea </th><th> Nombre </th><th> Eliminar </th></tr>";
        while (aux != null) {
            contador += 1;
            aux.indice = contador;
            res += `<tr><td>${aux.indice}</td><td>${aux.nombre}</td><td><button type='button' onclick='eliminarTarea(${aux.indice})'>Eliminar</button></td></tr>`;
            aux = aux.siguiente;
        }
        return res + "</table>";
    }

    Eliminar(tareaAEliminar) {
        if (tareaAEliminar == null) return;

        if (this.primero == tareaAEliminar) {
            this.primero = this.primero.siguiente;
            if (this.primero) {
                this.primero.anterior = null;
            } else {
                this.ultimo = null; // La lista queda vacía
            }
        } else if (this.ultimo == tareaAEliminar) {
            this.ultimo = this.ultimo.anterior;
            this.ultimo.siguiente = null;
        } else {
            tareaAEliminar.anterior.siguiente = tareaAEliminar.siguiente;
            tareaAEliminar.siguiente.anterior = tareaAEliminar.anterior;
        }

        this.guardarEnLocalStorage();
    }

    buscar(indice) {
        return this._buscarDato(indice, this.primero);
    }

    _buscarDato(indice, nodo) {
        if (nodo == null) return null;
        if (nodo.indice == indice) {
            return nodo;
        }
        return this._buscarDato(indice, nodo.siguiente);
    }

    guardarEnLocalStorage() {
        let tareas = [];
        let aux = this.primero;
        while (aux != null) {
            tareas.push({ nombre: aux.nombre });
            aux = aux.siguiente;
        }
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }

    cargarDesdeLocalStorage() {
        let tareas = JSON.parse(localStorage.getItem("tareas"));
        if (tareas) {
            tareas.forEach((tareaData) => {
                this.Ingresar(new Tarea(tareaData.nombre));
            });
        }
    }
}

let lista = new ListaTareas();
lista.cargarDesdeLocalStorage(); // Cargar las tareas al iniciar la aplicación

function AñadirTarea() {
    let nombre = document.getElementById("input").value;
    let resultado = lista.Ingresar(crearTarea(nombre));
    if (resultado == null) {
        alert("No se puede ingresar una tarea vacía");
    } else {
        document.getElementById("input").value = "";
        document.getElementById("lista").innerHTML = lista.Listar();
    }
}

function crearTarea(nombre) {
    return new Tarea(nombre);
}

function eliminarTarea(indice) {
    let tarea = lista.buscar(indice);
    lista.Eliminar(tarea);
    document.getElementById("lista").innerHTML = lista.Listar();
}

// Actualiza la lista visual al cargar la página
document.getElementById("lista").innerHTML = lista.Listar();
