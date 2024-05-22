//Clase que se encargará de gestionar todo lo relacionado a la escena de combate.

//Declaro las variables y objetos que usaré.
let imagenFondoBatalla //Variable para almacenar la imagen del fondo de la batalla.
let fondoBatalla //Objeto que contendrá la información sobre el fondo de batalla.

let rana //Objeto que contendrá la información sobre el monstruo "rana".
let llama //Objeto que contendrá la información sobre el monstruo "llama".

let ataqueAleatorio	//Variable que almacenará un ataque generado aleatoriamente que realizará el enemigo.
let ataqueElegido //Variable que almacenará el ataque elegido por el jugador.
let botonAtaque //Variable que emplearé para crear los botones para cada ataque.

let colaAcciones = [] //Array al que le iremos añadiendo las distintas acciones del combate (ataques, derrotas, etc).
let spritesCargados = [] //Array que contendrá los sprites que se deben cargar al iniciar una batalla.

//declaro la imagen del fondo de la batalla
imagenFondoBatalla = new Image()
imagenFondoBatalla.src = "./img/battleBackground.png"

//Añadimos la información respecto al fondo de batalla al objeto correspondiente.
fondoBatalla = new ImagenModelo({
	posicion: {
		x: 0,
		y: 0
	},
	imagen: imagenFondoBatalla
})

//Llamo a la función animar para dar comienzo al bucle que hará que todo funcione.
animar()

//Función "iniciarBatalla", que se encargará de crear todo lo necesario para el correcto funcionamiento de la batalla.
function iniciarBatalla(){
	
	//Mostramos la interfaz de usuario.
	document.querySelector("#interfazUsuario").style.display = "block"
	//Ocultamos la caja de diálogo.
	document.querySelector("#cajaDialogo").style.display = "none"
	//Ponemos la barra de vida enemiga al completo.
	document.querySelector("#barraVidaEnemigo").style.width = "100%"
	//Ponemos la barra de vida aliada al completo.
	document.querySelector("#barraVidaJugador").style.width = "100%"
	//Nos aseguramos de que el menú de ataques esté vacío antes de rellenarlo con los ataques.
	document.querySelector("#menuAtaques").replaceChildren()

	rana = new Monstruo(monstruos.Rana)	//Sacamos la información de "Rana" de nuestra clase "monstruos y la añadimos al objeto
									//que he creado previamente del mismo nombre.

	llama = new Monstruo(monstruos.Llama) //Sacamos la información de "Llama" de nuestra clase "monstruos y la añadimos al objeto
									//que he creado previamente del mismo nombre.

	spritesCargados = [rana, llama]	//Añado los sprites que quiero que se carguen al empezar el combate.

	//Creo un botón para cada ataque que tenga "llama" (nuestro monstruo).
	llama.ataques.forEach(ataques =>{
		//Creo un botón con el nombre del ataque y que se añade al menú de ataques.
		botonAtaque = document.createElement("button")
		botonAtaque.innerHTML = ataques.nombre
		document.querySelector("#menuAtaques").append(botonAtaque)
	})

	//Selecciono todos los elementos "button" y le agrego un evento a cada uno.
	document.querySelectorAll("button").forEach((botonAtaque) => {

		//Evento que se activa al hacer "click" en uno de los ataques.
		botonAtaque.addEventListener("click", (e) => {

			//Guardo en una variable el ataque elegido en base al botón que he clicado.
			ataqueElegido = ataques[e.currentTarget.innerHTML]

			//Llamo al método "ataque" para mi monstruo (llama).
			llama.ataque({ 
				ataque: ataqueElegido, //Le indico el ataque que quiero hacer.
				objetivo: rana,	//Y el objetivo de dicho ataque (monstruo enemigo).
				spritesCargados
			})

			//Si la barra de vida de la rana (enemigo) llega a 0 (hemos ganado):
			if (rana.vida <= 0){
				//Meteré en la cola de acciones:
				colaAcciones.push(() => {
					rana.derrota()	//Método derrota de la rana.
					audio.batalla.stop()	//Se parará el audio de batalla.
					audio.victoria.play()	//Comenzará un audio de victoria.
					audio.mapa.play()	//Comenzará de nuevo la música del mapa.

					//Volvemos a mostrar la pantalla en negro con gsap.
					gsap.to("#divSuperpuesto", {
						opacity: 1,
						onComplete: ()=>{
							//Cancelaremos la animación de batalla, y volveremos con la animación del mundo.
							cancelAnimationFrame(idBatalla)
							animar()

							//Ocultamos la interfaz del usuario y la pantalla en negro.
							document.querySelector("#interfazUsuario").style.display = "none"
							gsap.to("#divSuperpuesto", {
								opacity: 0
							})

							batalla.iniciada=false	//Ponemos la variable iniciada, de batalla, en false.
						}
					})
				})	

			} 

			//Hago el ataque aleatorio que hará el monstruo enemigo y lo meto en la variable creada anteriormente.
			ataqueAleatorio = rana.ataques[Math.floor(Math.random() * rana.ataques.length)]

			//Añadimos a la cola el ataque aleatorio de la rana.
			colaAcciones.push(() => {
				rana.ataque({ 
					ataque: ataqueAleatorio,
					objetivo: llama,
					spritesCargados
				})

				//Si la vida de "llama" llega a 0 (hemos perdido):
				if (llama.vida <= 0){	
					//Metemos en la cola:
					colaAcciones.push(() => {
						llama.derrota()	//método derrota de llama.
						audio.batalla.stop() //Se para el audio de la batalla.
						audio.mapa.play() //Suena el audio del mundo.
					})	

					colaAcciones.push(() => {
						gsap.to("#divSuperpuesto", {
							opacity: 1,
							onComplete: ()=>{
								//Cancelaremos la animación de batalla, y volveremos con la animación del mundo.
								cancelAnimationFrame(idBatalla)
								animar()

								//Ocultamos la interfaz del usuario y la pantalla en negro.
								document.querySelector("#interfazUsuario").style.display = "none"
								gsap.to("#divSuperpuesto", {
									opacity: 0
								})

								batalla.iniciada=false	//Ponemos la variable iniciada, de batalla, en false.
							}
						})
					})	
				} 
			})

		})

		//Evento que muestra el tipo del ataque que tenga el ratón encima.
		botonAtaque.addEventListener("mouseenter", (e) => {

			//Metemos en una variable el ataque que está siendo seleccionado.
			ataqueElegido = ataques[e.currentTarget.innerHTML]

			//Haciendo referencia al elemento de HTML mediante su id, cambiaremos el color de las letras dependiendo del tipo.
			document.querySelector("#tipoAtaqueCaja").innerHTML = ataqueElegido.tipo

			//En caso de tipo "normal", el color será gris, y en caso de ser de tipo "fuego", el color será rojo.
			switch(ataqueElegido.tipo){
				case "Normal":
					document.querySelector("#tipoAtaqueCaja").style.color = "grey"
				break;
				case "Fuego":
						document.querySelector("#tipoAtaqueCaja").style.color = "red"
				break;
			}

			
		})

	})

}

//Función en bucle que permitirá animar la batalla.
function animarBatalla(){
	idBatalla = window.requestAnimationFrame(animarBatalla) //con esta variable se crea el bucle infinito. Primero se llama al 
												//método "animarBatalla", este a su vez llama a la función "requestAnimationFrame",
											//que apunta de nuevo al método. El valor que da la función en el último bucle
										//ejecutado la guardaremos en la variable "idBatalla" para poder salir del bucle.
	
	//Dibujo los sprites del fondo y de los monstruos. El fondo se dibuja primero porque es lo que va detrás.
	fondoBatalla.dibujar()
	rana.dibujar()
	llama.dibujar()

	//Recorro mi array de sprites que deben ser cargados, y los voy dibujando.
	spritesCargados.forEach((sprite) => {
		sprite.dibujar()
	})
}

//Evento para poder clicar en la caja de diálogo.
document.querySelector("#cajaDialogo").addEventListener("click", (e) => {

	if(colaAcciones.length > 0){
		//Volvemos a la posición 0 de la cola de acciones y borramos los datos que hubiesen dentro.
		colaAcciones[0]()
		colaAcciones.shift()
	} else{
		//Cuando no hay acciones, se oculta la caja de diálogo.
		e.currentTarget.style.display = "none"
	}
})