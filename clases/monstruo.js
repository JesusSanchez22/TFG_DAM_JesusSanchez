
//Clase "Monstruo" en la que definiré los atributos y métodos para crear objetos de tipo "Monstruo".
//Esta clase heredará atributos y métodos de su clase padre, "ImagenModelo".
class Monstruo extends ImagenModelo{

	//Creamos el constructor.
	constructor({
		posicion, 
		imagen, 
		frames = { numero: 1, hold: 20 }, 
		sprites, animado = false, 
		enemigo = false, 
		nombre,
		ataques
	}){
		super({
			posicion,
			imagen,
			frames,
			animado,
			sprites
		})
		this.vida = 100
		this.enemigo = enemigo
		this.nombre = nombre
		this.ataques = ataques
	}

	//Método "derrota" para cuando el monstruo pierda todos sus puntos de vida.
	derrota(){
		//Selecciono la caja de diálogo mediante su id para escribir que el monstruo ha sido derrotado.
		document.querySelector("#cajaDialogo").innerHTML = this.nombre + " ha sido derrotado"

		//Con gsap muevo el sprite hacia abajo y le bajo la opacidad para dar un efecto de que el monstruo ha sido derrotado.
		gsap.to(this.posicion, {
			y: this.posicion.y + 20
		})
		gsap.to(this, {
			opacity: 0
		})
	}

	//Método "ataque" para que tanto nuestro monstruo como el enemigo puedan realizar un ataque.
	ataque({ataque, objetivo, spritesCargados}) {

		//Después de usar un ataque queremos que aparezca una caja de diálogo en la barra inferior 
		//(donde aparecían los ataques) diciendo el monstruo que ha usado el ataque, y el nombre de dicho ataque.
		document.querySelector("#cajaDialogo").style.display = "block"	//Mostramos la caja de diálogo.
		document.querySelector("#cajaDialogo").innerHTML = this.nombre + " ha usado " + ataque.nombre //Mostramos en la caja el
																							//nombre del monstruo y del ataque.
		//Creamos una variable para la barra de vida del objetivo al que se ataca.
		let barraVida = "#barraVidaEnemigo"	//En caso normal (jugador), será la barra de vida del enemigo.
		if(this.enemigo) barraVida = "#barraVidaJugador" //En caso de ser enemigo, será la barra de vida del jugador.

		objetivo.vida -= ataque.daño //Se le resta la vida al objetivo equivalente al daño del ataque que le han hecho.

		let distanciaRecorrida = 20 //Creamos una variable para indicar cuanto se tiene que mover el monstruo
										//al hacer el ataque o al rebirlo.

		//Creamos un switch para que según el ataque elegido, se ejecute un código u otro.
		switch(ataque.nombre){	
			case "Placaje":
				//Para hacer la animación del placaje, creamos una linea de tiempo con gsap.
				const lineaTiempo = gsap.timeline()

				
				if(this.enemigo) distanciaRecorrida = -20 //Como el enemigo está en el lado contrario, se tendrá que mover
													//al lado contrario.

				lineaTiempo.to(
					this.posicion, {x: this.posicion.x - distanciaRecorrida //Movemos al monstruo los píxeles que indicamos 
																		//en la variable "distanciaRecorrida" hacia atrás.
				}).to(
					this.posicion, {x: this.posicion.x + distanciaRecorrida * 2, duration: 0.1,	//Y luego lo movemos hacia 
																							//adelante.
					onComplete: () => {
						//Al completar la animación:
						audio.placaje.play()	//Suena el audio "placaje".
						gsap.to(barraVida, {
							width: objetivo.vida + "%"	//Actualizamos la barra de vida con la vida que le falta.
						})

						//Hacemos una pequeña animación para que el enemigo también se mueva al recibir el golpe.
						gsap.to(objetivo.posicion, {	
							x: objetivo.posicion.x + distanciaRecorrida,
							yoyo: true,
							repeat: 1,
							duration: 0.4,
						})
						gsap.to(objetivo, {
							opacity: 0,
							repeat: 1,
							yoyo: true,
							duration: 0.08
						})
					}
				}).to(this.posicion, {
					x: this.posicion.x //Devolvemos al monstruo a su posición original.
				})
			break;

			case "Ascuas":
				//Para la animación de las ascuas haremos lo siguiente:
				audio.ascuasInicio.play()	//Damos comienzo al audio de las ascuas.

				//Creamos la imagen de las ascuas.
				const ascuasImagen = new Image()
				ascuasImagen.src="./img/fireball.png"

				//Creamos un objeto "ascuas" con la información necesaria.
				const ascuas = new ImagenModelo({
					//La posición será la misma a la del monstruo que hace el ataque (saldrá de él).
					posicion: {
						x: this.posicion.x,
						y: this.posicion.y
					},
					imagen: ascuasImagen,	
					//Como tendrá animación, declaramos la información necesaria sobre los frames.
					frames: {
						numero: 4,
						hold: 20
					},
					animado: true
				})

				//Añadimos al array de sprites cargados, el objeto "ascuas".
				spritesCargados.push(ascuas)

				//Usamos gsap para que la animación de las ascuas viaje desde el monstruo que hace el ataque, hasta 
				//el monstruo que lo recibe.
				gsap.to(ascuas.posicion, {
					x: objetivo.posicion.x,	//Coordenadas del objetivo.
					y: objetivo.posicion.y,

					//Una vez completado el ataque:
					onComplete: () => {

						audio.ascuasGolpe.play()	//Sonará un sonido de impacto.

						//Se reducirá la barra de vida del receptor del ataque.
						gsap.to(barraVida, {
							width: objetivo.vida + "%"
						})

						//El objetivo tendrá una pequeña animación indicando que ha recibido el impacto.
						gsap.to(objetivo.posicion, {
							x: objetivo.posicion.x + distanciaRecorrida,
							yoyo: true,
							repeat: 1,
							duration: 0.4,
						})
						gsap.to(objetivo, {
							opacity: 0,
							repeat: 1,
							yoyo: true,
							duration: 0.08
						})

						//Para que desaparezca el sprite de las ascuas una vez golpeado al objetivo, usaremos el método
						//"pop()", que elimina el último elemento de un array, en este caso, las ascuas.
						spritesCargados.pop()
					}
				})

			break;
		}
	}
}