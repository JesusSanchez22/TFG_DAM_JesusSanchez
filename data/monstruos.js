//Clase con la información sobre los monstruos que existen en el juego.
//Objeto que contiene los monstruos que añadiremos. 
const monstruos = {

	//Monstruo "llama".
	Llama: {
		posicion: {	//Definimos su posición en el campo de batalla.
			x:500,
			y:600
		},
		imagen: {	//Definimos la ruta a la imagen.
			src: "./img/llamaSprite.png"
		},
		frames: {	//El número de frames, y la velocidad para pasar de uno a otro. 
			numero: 4,
			velocidad: 60
		},
		animado: true,	//Está animado.
		nombre: "llama",	//Nombre que aparecerá en las interfaces.
		ataques: [ataques.Placaje, ataques.Ascuas]	//Los ataques que tendrá disponibles.
	},

	//Monstruo "rana".
	Rana: {
		posicion: {
			x:1200,
			y:400
		},
		imagen: {
			src: "./img/ranaSprite.png"
		},
		frames: {
			numero: 5,
			velocidad: 40
		},
		animado: true,
		enemigo: true,	//Tiene una propiedad extra que indica que es un monstruo enemigo.
		nombre: "Rana",
		ataques: [ataques.Placaje, ataques.Ascuas]
	}
}