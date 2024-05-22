//Clase con la información de los ataques.
//Objeto "ataques" en el que podremos añadir todos los ataques que querramos usar.
const ataques = {

	//Ataque "placaje".
	Placaje: {
		nombre: "Placaje", //Nombre del ataques que aparecerá en la interfaz del usuario.
		daño: 15,	//El daño que hará el ataque.
		tipo: "Normal" //Tipo de dicho ataque. Saldrá especificado en un recuadro a la derecha en la interfaz y será útil para
					//actualizaciones futuras de la aplicación.
	},

	//Ataque "ascuas".
	Ascuas: {
		nombre: "Ascuas",
		daño: 30,
		tipo: "Fuego"
	}
}