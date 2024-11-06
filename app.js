class Tarea {
    constructor(nombre) {
        this.id = Date.now();
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

    async Ingresar(nuevaTarea) {
        if (nuevaTarea.nombre == "") {
            return null;
        } else {
            try {
                const response = await fetch("https://qb6p7rrs-3000.usw3.devtunnels.ms/task", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({nombre: nuevaTarea.nombre })
                });
                const data = await response.json();
                nuevaTarea.id = data.id;

                if (this.primero == null) {
                    this.primero = nuevaTarea;
                    this.ultimo = nuevaTarea;
                } else {
                    let aux = this.ultimo;
                    aux.siguiente = nuevaTarea;
                    nuevaTarea.anterior = aux;
                    this.ultimo = nuevaTarea;
                }

                return nuevaTarea;
            } catch (error) {
                console.error("Error al guardar la tarea en la API:", error);
            }
        }
    }

    async Listar() {
        try {
            const response = await fetch("https://qb6p7rrs-3000.usw3.devtunnels.ms/task");
            const tareas = await response.json();
            let res = "<table><tr><th> No. Tarea </th><th> Nombre </th><th> Eliminar </th></tr>";
            tareas.forEach((tarea, index) => {
                res += `<tr><td>${index + 1}</td><td>${tarea.nombre}</td><td><button type='button' onclick='eliminarTarea(${tarea.id})'>Eliminar</button></td></tr>`;
            });
            document.getElementById("lista").innerHTML = res + "</table>";
        } catch (error) {
            console.error("Error al cargar las tareas desde la API:", error);
        }
    }

    async Eliminar(id) {
        try {
            await fetch(`https://qb6p7rrs-3000.usw3.devtunnels.ms/task/${id}`, { method: "DELETE" });
            this.Listar();
        } catch (error) {
            console.error("Error al eliminar la tarea de la API:", error);
        }
    }
}

let lista = new ListaTareas();
lista.Listar()

function AñadirTarea() {
    let nombre = document.getElementById("input").value;
    if (nombre === "") {
        alert("No se puede ingresar una tarea vacía");
    } else {
        let nuevaTarea = new Tarea(nombre);
        lista.Ingresar(nuevaTarea).then(() => {
            document.getElementById("input").value = "";
            lista.Listar();
        });
    }
}

function eliminarTarea(id) {
    lista.Eliminar(id);
}
