//Llamo al canvas y lo meto en una variable.
const canvas = document.querySelector("canvas")
const contexto = canvas.getContext("2d")	//Creo el contexto sobre el que voy a trabajar, en este caso, dos dimensiones.

//Ajusto el tamaño del canvas para que sea igual al de la ventana.
canvas.width = window.innerWidth
canvas.height = window.innerHeight

//Variables y objetos que voy a usar.
let imagenObjetosSuperpuestos	//Imagen de los objetos superpuestos (la copa de los árboles, el tejado de la casa).
let imagenMapa	//Imagen del mapa.

//Imágenes del jugador para cada una de las direcciones
let imagenJugadorAbajo
let imagenJugadorArriba
let imagenJugadorIzquierda
let imagenJugadorDerecha

let fondo //Objeto que contendrá la información del fondo (mapa).
let capaSuperior //Objeto que tendrá la información de los objetos superpuestos.

let moviendo	//Variable para comprobar si el personaje se mueve o no.
let clickado = false	//Variable que usaré para determinar si se ha clickado en la pantalla.
let teclas	//Objeto que contendrá la información sobre las teclas que se pueden usar.
let coordenadasPosicion		//Objeto con la información sobre las coordenadas de inicio.

let jugador 	//Objeto que contendrá la información sobre el jugador que controla el usuario.
let batalla 	//Objeto que contendrá la información de la batalla.

let cajaColision 	//Objeto que contendrá la información sobre una caja de colisión en concreto.
let zonaBatalla 	//Objeto que contendrá la información sobre una de las zonas de batalla en concreto.

let idAnimacion 	//Variable que ira almacenando el id del bucle de animación.

//arrays que usaré.
const mapaColisiones = [] 	//array donde se almacena la información sobre las cajas de colisiones.
const mapaZonasBatalla = [] 	//array donde se almacena la información sobre las zonas de batalla.
const cajasColision = [] 	//array donde se almacena cada una de las cajas de colision.
const zonasBatalla = [] 	//array donde se almacena cada una de las zonas de batalla.
let objetosMovibles  	//array que almacena todos los elementos que se moverán al andar con el jugador.

//creo un objeto "coordenadasPosicion" con los atributos "x" e "y" que servirán como
//coordenadas para posicionar los distintos elementos en el canvas.
coordenadasPosicion = {
	x: -4300,
	y: -2850
}

//objeto "batalla" con un atributo "iniciada" que usaremos para determinar cuando empieza y
//cuando termina un combate. Por defecto estará en "false".
batalla = {
	iniciada: false
}

//declaro las imágenes que voy a usar.
//imagen para los objetos superpuestos (los que queremos que salgan por delante del personaje).
imagenObjetosSuperpuestos = new Image()
imagenObjetosSuperpuestos.src="./img/ObjetosSuperpuestos.png"

//imagen del mapa
imagenMapa = new Image()
imagenMapa.src = "./img/MapaTFG.png"

//imagen del jugador mirando abajo
imagenJugadorAbajo = new Image()
imagenJugadorAbajo.src="./img/jugadorAbajo.png"

//imagen del jugador mirando arriba
imagenJugadorArriba = new Image()
imagenJugadorArriba.src="./img/jugadorArriba.png"

//imagen del jugador mirando a la izquierda
imagenJugadorIzquierda = new Image()
imagenJugadorIzquierda.src="./img/jugadorIzquierda.png"

//imagen del jugador mirando a la derecha
imagenJugadorDerecha = new Image()
imagenJugadorDerecha.src="./img/jugadorDerecha.png"

//Objeto "teclas" con la información para comprobar si las teclas para mover al personaje son pulsadas.
teclas = {
	w: {
		pulsada: false
	},
	a: {
		pulsada: false
	},
	s: {
		pulsada: false
	},
	d: {
		pulsada: false
	}
}

//objeto "Jugador" en base al molde "ImagenModelo" que he creado en la clase del mismo nombre.
jugador = new ImagenModelo({
	posicion: { //defino la posición del jugador en el mapa.
		x: canvas.width/2 - 192 /4 /2, //Cálculo para centrar al jugador en el mapa. 192 es el ancho de la imagen, lo 
									//dividimos entre 4, ya que tiene 4 frames. Esto daría como resultado un sólo frame
								//del personaje que estaría colocado por su lado izquierdo, para que quede centrado del todo,
							//lo dividiré entre 2 para que se coloque a partir de su centro.
		y: canvas.height/2
	},
	imagen: imagenJugadorAbajo, //añado la imagen del jugador
	frames: { //Defino lo relacionado a los "frames".
		numero: 4,	//Número de frames.
		velocidad: 20  //velocidad para pasar de uno a otro
	},
	sprites: { //asigno cada uno de los sprites a las distintas direcciones
		arriba: imagenJugadorArriba,
		izquierda: imagenJugadorIzquierda,
		derecha: imagenJugadorDerecha,
		abajo: imagenJugadorAbajo
	}
})

//objeto "fondo" en base a "ImagenModelo" para crear el mapa por el que se moverá
//nuestro personaje.
fondo = new ImagenModelo({
	posicion: {
		x: coordenadasPosicion.x,
		y: coordenadasPosicion.y
	},
	imagen: imagenMapa
})

//objeto "capaSuperior" creado a partir de "ImagenModelo" para importar aquellos elementos
//que queremos que estén por encima de nuestro personaje, como las copas de los árboles.
capaSuperior = new ImagenModelo({
	posicion: {
		x: coordenadasPosicion.x,
		y: coordenadasPosicion.y
	},
	imagen: imagenObjetosSuperpuestos
})

//Bucle para meter en el array mapaColisiones la información de "infoCajasColision".
//Mi objetivo es crear un array para cada fila de información que forma mi mapa, por ello empleo el número 150,
//porque es el número de "tiles" que forman una fila en mi mapa en concreto.
for (let i = 0; i < infoCajasColision.length; i+=150){	
	mapaColisiones.push(infoCajasColision.slice(i, 150 + i)) //para ello empleo el método "slice", que me permite devolver
														//una copia de una parte del array dentro de un nuevo array, pudiendo
													//definir un inicio (i), y un final (150 + i)
}

//Creamos las cajas recorriendo el mapa con un array bidimensional
mapaColisiones.forEach((fila, i) => {	//la "i" representa el índice de la fila.
	fila.forEach((codigo, j) => {	//la "j" representa el índice del elemento en la fila.
		if(codigo===355){	//355 es el código que representa el tile de las cajas de colision.
			cajasColision.push(
				new CajaColision({
					posicion: {
						x: j * CajaColision.ancho + coordenadasPosicion.x,	//Multiplicamos "j" por el ancho de la caja, para
																		//conseguir el valor de la "x" en píxeles.

						y: i * CajaColision.alto + coordenadasPosicion.y 	//El mismo cálculo haremos para la "y".
					}
				})
			)
		}
	})
})


//Para crear las zonas de batalla empleo el mismo método que con las colisiones.
for (let i = 0; i < infoZonasBatalla.length; i+=150){
	mapaZonasBatalla.push(infoZonasBatalla.slice(i, 150 + i))
}

//Para crear cada zona de batalla seguiremos la misma lógica que con las cajas de colisión.
mapaZonasBatalla.forEach((fila, i) => {
	fila.forEach((codigo, j) => {
		if(codigo===3159){ //En este caso cambiaríamos el código al del tile que corresponda con las zonas de batalla.
			zonasBatalla.push(
				new CajaColision({
					posicion: {
						x: j * CajaColision.ancho + coordenadasPosicion.x,
						y: i * CajaColision.alto + coordenadasPosicion.y
					}
				})
			)
		}
	})
})

//añado a la lista de objetos moviles, los distintos elementos que se moverán al andar.
objetosMovibles = [fondo, ...cajasColision, capaSuperior, ...zonasBatalla]

//Función encargada de comprobar si el un "objeto1" (el jugador) entra en contacto con un 
//"objeto2" (cajas de colisión o zonas de batalla).
function colisionJugador({ objeto1, objeto2 }){
	return(
		//Comprobamos si el lado derecho del jugador está más a la derecha que el lado izquierdo de la caja.
		objeto1.posicion.x + objeto1.ancho >= objeto2.posicion.x &&	 
		//Comprobamos si el lado izquierdo del jugador está más a la izquierda que el lado derecho de la caja.
		objeto1.posicion.x <= objeto2.posicion.x + objeto2.ancho &&
		//Comprobamos si el lado inferior del jugador está más arriba que el lado superior de la caja.
		objeto1.posicion.y <= objeto2.posicion.y + objeto2.alto &&
		//Comprobamos si el lado superior del jugador está más abajo que el lado inferior de la caja.
		objeto1.posicion.y + objeto1.alto >= objeto2.posicion.y 
	)
}

//funcion en bucle "animar", que será la base para que funcione todo. 
function animar(){ 
	idAnimacion = window.requestAnimationFrame(animar)	//con esta variable se crea el bucle infinito. Primero se llama al 
												//método "animar", este a su vez llama a la función "requestAnimationFrame",
											//que apunta de nuevo al método. El valor que da la función en el último bucle
										//ejecutado la guardaremos en la variable "idAnimacion" para poder salir del bucle.

	fondo.dibujar()	//llamo al método "dibujar", para crear el fondo, es decir, el mapa.
	jugador.dibujar()	//llamo al método "dibujar", para crear al jugador en el mapa.
	capaSuperior.dibujar()	//llamo al método "dibujar", para crear los objetos superpuestos en el mapa.
	//Es importante el orden en el que se llaman a estos métodos para definir qué elementos están delante y cuales detrás.

	//Hacemos un forEach para que se dibuje una caja de colisión para cada elemento que haya en el array "cajasColision",
	//que previamente hemos rellenado al recorrer el mapa como un array de dos dimensiones.
	cajasColision.forEach((cajaColision) => {
		cajaColision.dibujar()
	})

	//Hacemos un forEach para que se dibuje una zona de batalla para cada elemento que haya en el array "zonasBatalla",
	//que previamente hemos rellenado al recorrer el mapa como un array de dos dimensiones.
	zonasBatalla.forEach(zonaBatalla => {
		zonaBatalla.dibujar()
	})

	moviendo = true
	jugador.animado = false

	//if(batalla.iniciada) return

	//Para entrar en batalla:
	//Debemos estar en movimiento, así que controlamos si alguna de las teclas está siendo pulsada.
	if(teclas.w.pulsada || teclas.a.pulsada || teclas.s.pulsada || teclas.d.pulsada){

		//Recorro todas las zonas de batalla.
		for (let i = 0; i < zonasBatalla.length; i++){
			zonaBatalla = zonasBatalla[i]

			//Detecto si el jugador está colisionando con una zona de batalla mediante el método "colisionJugador".
			if(
				colisionJugador({
					objeto1: jugador,
					objeto2: zonaBatalla
				}) 
				&& Math.random() < 0.005	//Le añado un factor aleatorio, para que tengas que andar un poco antes
										//de que te salga una batalla.
			){
				//En caso de entrar en contacto, iniciaríamos el siguiente código:
				window.cancelAnimationFrame(idAnimacion)	//Daríamos fin al bucle "animar", mediante le "idAnimacion".

				//Pararíamos la música del mapa, e iniciariamos la de la batalla.
				audio.mapa.stop()
				audio.iniciarBatalla.play()
				audio.batalla.play()

				batalla.iniciada = true //A la variable "iniciada" del objeto batalla, le daríamos el valor verdadero.

				//Realizo una animación mediante gsap.
				//En este caso trataré de dar el efecto de que la pantalla parpadea hasta que nos mete en la batalla.
				gsap.to("#divSuperpuesto", {
					opacity: 1,
					repeat: 3,
					yoyo: true,
					duration: 0.4,
					onComplete(){
						gsap.to("#divSuperpuesto", {
							opacity: 1,
							duration: 0.4,
							onComplete(){	//Una vez completada la animación, activamos los métodos necesarios para la batalla.
								iniciarBatalla()
								animarBatalla()

								gsap.to("#divSuperpuesto", {
									opacity: 0,
									duration: 0.4,
								})
							}
						})
					}
				})
				break
			}
		}
	}

	//ifs anidados que comprueban que tecla se pulsa para poder mover al personaje.
	if(teclas.w.pulsada){
		jugador.animado=true	//le damos al jugador el valor de animado para que sea verdadero.
		jugador.imagen=jugador.sprites.arriba 	//le asignamos al jugador el sprite que corresponde, en este caso el de arriba.

		//Para detectar si el personaje entra en contacto con una colisión, uso el siguiente código:
		//La lógica es que para que el personaje no pueda atravesar una caja debo predecir cuando va a entrar en contacto
		//con ella:
		for (let i = 0; i < cajasColision.length; i++){	
			cajaColision = cajasColision[i]	//Recorro todas las cajas y las almaceno en una variable.
			
			//Uso la función "colisionJugador" que he creado anteriormente.
			if(
				colisionJugador({
					objeto1: jugador,	//Le paso como primer objeto al jugador.
					objeto2: {	//Le paso como segundo objeto la caja con la que choca el jugador.
						...cajaColision,	//Este operador (Spread operator), me permite crear una copia de la caja sin
										//sobreescribir la información de la caja original.
						posicion: {
							x: cajaColision.posicion.x,	
							y: cajaColision.posicion.y + 3 //Muevo la copia un poco más abajo para así hacer el efecto
														//de "predecir" que el jugador choca contra la caja original. 	
						}
					}
				})
			){
				//Una vez entro en contacto, desactivo la capacidad de mover al jugador en esa dirección.
				moviendo = false
				break
			}
		}

		//Comprobamos que el jugador se mueve, en caso afirmativo, movemos todos los objetos dentro de la lista 
		//de "objetosMovibles" en la dirección que corresponda, en este caso, hacia arriba.
		if(moviendo){
			objetosMovibles.forEach((objeto)=>{
				objeto.posicion.y +=3
			})
		}
		
	} //el resto de ifs siguen la misma lógica que el anterior.
	else if(teclas.s.pulsada){
		jugador.animado=true
		jugador.imagen=jugador.sprites.abajo
		for (let i = 0; i < cajasColision.length; i++){
			const cajaColision = cajasColision[i]
			
			if(
				colisionJugador({
					objeto1: jugador,
					objeto2: {
						...cajaColision,
						posicion: {
							x: cajaColision.posicion.x,
							y: cajaColision.posicion.y - 3
						}
					}
				})
			){
		
				moviendo = false
				break
			}
		}

		
		if(moviendo){
			objetosMovibles.forEach((objeto)=>{
				objeto.posicion.y -=3
			})
		}
		
	} 
	else if(teclas.a.pulsada){
		jugador.animado=true
		jugador.imagen=jugador.sprites.izquierda
		for (let i = 0; i < cajasColision.length; i++){
			const cajaColision = cajasColision[i]
			
			if(
				colisionJugador({
					objeto1: jugador,
					objeto2: {
						...cajaColision,
						posicion: {
							x: cajaColision.posicion.x+3,
							y: cajaColision.posicion.y
						}
					}
				})
			){

				moviendo = false
				break
			}
		}

		
		if(moviendo){
			objetosMovibles.forEach((objeto)=>{
				objeto.posicion.x +=3
			})
		}
		
	} 
	else if(teclas.d.pulsada){
		jugador.animado=true
		jugador.imagen=jugador.sprites.derecha
		for (let i = 0; i < cajasColision.length; i++){
			const cajaColision = cajasColision[i]
			
			if(
				colisionJugador({
					objeto1: jugador,
					objeto2: {
						...cajaColision,
						posicion: {
							x: cajaColision.posicion.x-3,
							y: cajaColision.posicion.y
						}
					}
				})
			){
				moviendo = false
				break
			}
		}

		
		if(moviendo){
			objetosMovibles.forEach((objeto)=>{
				objeto.posicion.x -=3
			})
		}
		
	} 

}

//evento que detectará si alguna de las teclas que usaré para mover al personaje es presionada.
window.addEventListener("keydown", (tecla) =>{

	switch(tecla.key){
		case "s":
			teclas.s.pulsada = true
			break

		case "d":
			teclas.d.pulsada = true
			break

		case "w":
			teclas.w.pulsada = true
			break

		case "a":
			teclas.a.pulsada = true
			break
	}
})

//evento que detectará si alguna de las teclas que usaré para mover al personaje es levantada.
window.addEventListener("keyup", (tecla) =>{

	switch(tecla.key){
		case "s":
			teclas.s.pulsada = false
			break

		case "d":
			teclas.d.pulsada = false
			break

		case "w":
			teclas.w.pulsada = false
			break

		case "a":
			teclas.a.pulsada = false
			break

	}
})

//evento que detectará si se hace click en la pantalla. Servirá para dar inicio a la música del mapa.
addEventListener("click", () => {
	if(!clickado){
		audio.mapa.play()
		clickado = true
	}
})

