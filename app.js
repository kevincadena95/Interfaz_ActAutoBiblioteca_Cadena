const URL_AUTORES = "http://localhost:8080/api/autores";
const URL_CATEGORIAS = "http://localhost:8080/api/categorias";
const URL_PERFILES = "http://localhost:8080/api/perfiles";
const URL_LIBROS = "http://localhost:8080/api/libros";


function limpiarCampos(ids) {
    ids.forEach(id => {
        const campo = document.getElementById(id);

        if (campo != null) {
            campo.value = "";
        }
    });
}

async function mostrarError(respuesta, mensaje) {
    try {
        const error = await respuesta.json();
        alert(mensaje + "\n" + JSON.stringify(error, null, 2));
    } catch (e) {
        const errorTexto = await respuesta.text();
        alert(mensaje + "\n" + errorTexto);
    }
}

function textoAutor(autor) {
    if (!autor) {
        return "";
    }

    return autor.id + " - " + autor.nombre + " " + autor.apellido;
}

function textoCategorias(categorias) {
    if (!categorias || categorias.length === 0) {
        return "Sin categorías";
    }

    return categorias
        .map(c => c.id + " - " + c.nombreCategoria)
        .join("<br>");
}

function textoLibros(libros) {
    if (!libros || libros.length === 0) {
        return "Sin libros";
    }

    return libros
        .map(l => l.id + " - " + l.titulo)
        .join("<br>");
}



async function guardarAutor() {
    const autor = {
        nombre:
            document.getElementById("nombreAutor").value,

        apellido:
            document.getElementById("apellidoAutor").value,

        biografiaCorta:
            document.getElementById("biografiaCortaAutor").value
    };

    try {
        const respuesta = await fetch(URL_AUTORES, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(autor)
        });

        if (!respuesta.ok) {
            await mostrarError(respuesta, "No se pudo registrar el autor.");
            return;
        }

        alert("Autor registrado correctamente.");

        limpiarCampos([
            "nombreAutor",
            "apellidoAutor",
            "biografiaCortaAutor"
        ]);

        listarAutores();
        cargarAutoresSelects();

    } catch (error) {
        console.error(error);
        alert("Error al registrar el autor.");
    }
}

async function listarAutores() {
    try {
        const respuesta = await fetch(URL_AUTORES);
        const autores = await respuesta.json();

        let tabla = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Biografía corta</th>
            <th>Perfil relacionado</th>
            <th>Libros relacionados</th>
            <th>Acción</th>
        </tr>
        `;

        autores.forEach(a => {
            tabla += `
            <tr>
                <td>${a.id}</td>
                <td>${a.nombre}</td>
                <td>${a.apellido}</td>
                <td>${a.biografiaCorta || ""}</td>
                <td>${a.perfil ? a.perfil.id + " - " + a.perfil.nacionalidad : "Sin perfil"}</td>
                <td>${textoLibros(a.libros)}</td>
                <td>
                    <button onclick="eliminarAutor(${a.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
            `;
        });

        document.getElementById("tablaAutores").innerHTML = tabla;

    } catch (error) {
        console.error(error);
        alert("Error al listar autores.");
    }
}

async function eliminarAutor(id) {
    if (!confirm("¿Desea eliminar este autor?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${URL_AUTORES}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            await mostrarError(respuesta, "No se pudo eliminar el autor.");
            return;
        }

        alert("Autor eliminado correctamente.");

        listarAutores();
        cargarAutoresSelects();

    } catch (error) {
        console.error(error);
        alert("Error al eliminar el autor.");
    }
}

async function cargarAutoresSelects() {
    try {
        const respuesta = await fetch(URL_AUTORES);
        const autores = await respuesta.json();

        const autorPerfil = document.getElementById("autorPerfil");
        const autorLibro = document.getElementById("autorLibro");

        if (autorPerfil != null && autorPerfil.tagName === "SELECT") {
            autorPerfil.innerHTML = `
            <option value="">
                Seleccione un autor
            </option>
            `;

            autores.forEach(a => {
                autorPerfil.innerHTML += `
                <option value="${a.id}">
                    ${a.nombre} ${a.apellido}
                </option>
                `;
            });
        }

        if (autorLibro != null && autorLibro.tagName === "SELECT") {
            autorLibro.innerHTML = `
            <option value="">
                Seleccione un autor
            </option>
            `;

            autores.forEach(a => {
                autorLibro.innerHTML += `
                <option value="${a.id}">
                    ${a.nombre} ${a.apellido}
                </option>
                `;
            });
        }

    } catch (error) {
        console.error(error);
    }
}



async function guardarCategoria() {
    const categoria = {
        nombreCategoria:
            document.getElementById("nombreCategoria").value,

        descripcion:
            document.getElementById("descripcionCategoria").value
    };

    try {
        const respuesta = await fetch(URL_CATEGORIAS, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(categoria)
        });

        if (!respuesta.ok) {
            await mostrarError(respuesta, "No se pudo registrar la categoría.");
            return;
        }

        alert("Categoría registrada correctamente.");

        limpiarCampos([
            "nombreCategoria",
            "descripcionCategoria"
        ]);

        listarCategorias();
        cargarCategoriasLibro();

    } catch (error) {
        console.error(error);
        alert("Error al registrar la categoría.");
    }
}

async function listarCategorias() {
    try {
        const respuesta = await fetch(URL_CATEGORIAS);
        const categorias = await respuesta.json();

        let tabla = `
        <tr>
            <th>ID</th>
            <th>Nombre categoría</th>
            <th>Descripción</th>
            <th>Libros relacionados</th>
            <th>Acción</th>
        </tr>
        `;

        categorias.forEach(c => {
            tabla += `
            <tr>
                <td>${c.id}</td>
                <td>${c.nombreCategoria}</td>
                <td>${c.descripcion || ""}</td>
                <td>${textoLibros(c.libros)}</td>
                <td>
                    <button onclick="eliminarCategoria(${c.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
            `;
        });

        document.getElementById("tablaCategorias").innerHTML = tabla;

    } catch (error) {
        console.error(error);
        alert("Error al listar categorías.");
    }
}

async function eliminarCategoria(id) {
    if (!confirm("¿Desea eliminar esta categoría?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${URL_CATEGORIAS}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            await mostrarError(respuesta, "No se pudo eliminar la categoría.");
            return;
        }

        alert("Categoría eliminada correctamente.");

        listarCategorias();
        cargarCategoriasLibro();

    } catch (error) {
        console.error(error);
        alert("Error al eliminar la categoría.");
    }
}


async function cargarCategoriasLibro() {
    try {
        const respuesta = await fetch(URL_CATEGORIAS);
        const categorias = await respuesta.json();

        const select = document.getElementById("categoriasLibro");

        if (select == null) {
            return;
        }

        select.innerHTML = "";

        categorias.forEach(c => {
            select.innerHTML += `
            <option value="${c.id}">
                ${c.id} - ${c.nombreCategoria}
            </option>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("Error al cargar las categorías en libros.");
    }
}



async function guardarPerfil() {
    const autorId = document.getElementById("autorPerfil").value;
    const fechaFallecimiento = document.getElementById("fechaFallecimiento").value;

    if (autorId === "") {
        alert("Debe seleccionar un autor.");
        return;
    }

    const perfil = {
        fechaNacimiento:
            document.getElementById("fechaNacimiento").value,

        fechaFallecimiento:
            fechaFallecimiento === "" ? null : fechaFallecimiento,

        nacionalidad:
            document.getElementById("nacionalidad").value,

        ocupacion:
            document.getElementById("ocupacion").value,

        reconocimientos:
            document.getElementById("reconocimientos").value,

        autor: {
            id: parseInt(autorId)
        }
    };

    console.log("Perfil enviado:", perfil);

    try {
        const respuesta = await fetch(URL_PERFILES, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(perfil)
        });

        if (!respuesta.ok) {
            await mostrarError(respuesta, "No se pudo registrar el perfil.");
            return;
        }

        alert("Perfil registrado correctamente.");

        limpiarCampos([
            "fechaNacimiento",
            "fechaFallecimiento",
            "nacionalidad",
            "ocupacion",
            "reconocimientos",
            "autorPerfil"
        ]);

        listarPerfiles();
        listarAutores();

    } catch (error) {
        console.error(error);
        alert("Error al registrar el perfil.");
    }
}

async function listarPerfiles() {
    try {
        const respuesta = await fetch(URL_PERFILES);
        const perfiles = await respuesta.json();

        let tabla = `
        <tr>
            <th>ID</th>
            <th>Fecha nacimiento</th>
            <th>Fecha fallecimiento</th>
            <th>Nacionalidad</th>
            <th>Ocupación</th>
            <th>Reconocimientos</th>
            <th>Autor relacionado</th>
            <th>Acción</th>
        </tr>
        `;

        perfiles.forEach(p => {
            tabla += `
            <tr>
                <td>${p.id}</td>
                <td>${p.fechaNacimiento}</td>
                <td>${p.fechaFallecimiento || "No registra"}</td>
                <td>${p.nacionalidad}</td>
                <td>${p.ocupacion}</td>
                <td>${p.reconocimientos || ""}</td>
                <td>${textoAutor(p.autor)}</td>
                <td>
                    <button onclick="eliminarPerfil(${p.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
            `;
        });

        document.getElementById("tablaPerfiles").innerHTML = tabla;

    } catch (error) {
        console.error(error);
        alert("Error al listar perfiles.");
    }
}

async function eliminarPerfil(id) {
    if (!confirm("¿Desea eliminar este perfil?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${URL_PERFILES}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            await mostrarError(respuesta, "No se pudo eliminar el perfil.");
            return;
        }

        alert("Perfil eliminado correctamente.");

        listarPerfiles();
        listarAutores();

    } catch (error) {
        console.error(error);
        alert("Error al eliminar el perfil.");
    }
}



async function guardarLibro() {
    const categoriasTexto = document.getElementById("categoriasLibro").value;


    const categoriasSeleccionadas = Array.from(
        document.getElementById("categoriasLibro").selectedOptions
    );

    const categorias = categoriasSeleccionadas.map(opcion => ({
        id: parseInt(opcion.value)
    }));



    const libro = {
        titulo:
            document.getElementById("titulo").value,

        isbn:
            document.getElementById("isbn").value,

        sinopsis:
            document.getElementById("sinopsis").value,

        fechaPublicacion:
            document.getElementById("fechaPublicacion").value,

        precio:
            parseFloat(
                document.getElementById("precio").value
            ),

        stock:
            parseInt(
                document.getElementById("stock").value
            ),

        autor: {
            id: parseInt(
                document.getElementById("autorLibro").value
            )
        },

        categorias:
            categorias
    };

    try {
        const respuesta = await fetch(URL_LIBROS, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(libro)
        });

        if (!respuesta.ok) {
            await mostrarError(respuesta, "No se pudo registrar el libro.");
            return;
        }

        alert("Libro registrado correctamente.");

        limpiarCampos([
            "titulo",
            "isbn",
            "sinopsis",
            "fechaPublicacion",
            "precio",
            "stock",
            "autorLibro",
            "categoriasLibro"
        ]);

        listarLibros();
        listarAutores();
        listarCategorias();

    } catch (error) {
        console.error(error);
        alert("Error al registrar el libro.");
    }
}

async function listarLibros() {
    try {
        const respuesta = await fetch(URL_LIBROS);
        const libros = await respuesta.json();

        let tabla = `
        <tr>
            <th>ID</th>
            <th>Título</th>
            <th>ISBN</th>
            <th>Sinopsis</th>
            <th>Fecha publicación</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Autor relacionado</th>
            <th>Categorías relacionadas</th>
            <th>Acción</th>
        </tr>
        `;

        libros.forEach(l => {
            tabla += `
            <tr>
                <td>${l.id}</td>
                <td>${l.titulo}</td>
                <td>${l.isbn}</td>
                <td>${l.sinopsis || ""}</td>
                <td>${l.fechaPublicacion}</td>
                <td>${l.precio}</td>
                <td>${l.stock}</td>
                <td>${textoAutor(l.autor)}</td>
                <td>${textoCategorias(l.categorias)}</td>
                <td>
                    <button onclick="eliminarLibro(${l.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
            `;
        });

        document.getElementById("tablaLibros").innerHTML = tabla;

    } catch (error) {
        console.error(error);
        alert("Error al listar libros.");
    }
}

async function eliminarLibro(id) {
    if (!confirm("¿Desea eliminar este libro?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${URL_LIBROS}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            await mostrarError(respuesta, "No se pudo eliminar el libro.");
            return;
        }

        alert("Libro eliminado correctamente.");

        listarLibros();
        listarAutores();
        listarCategorias();

    } catch (error) {
        console.error(error);
        alert("Error al eliminar el libro.");
    }
}



window.onload = function () {
    listarAutores();
    listarCategorias();
    listarPerfiles();
    listarLibros();

    cargarAutoresSelects();
    cargarCategoriasLibro();
};

