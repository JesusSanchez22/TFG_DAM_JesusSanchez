//clase para crear los bloques que impedirán al jugador avanzar.
class CajaColision {

	//definimos sus atributos con valores por defecto. 
	static ancho = 64
	static alto = 64

	//creamos un constructor al que se le puede especificar la posicion.
	constructor({posicion}){
		this.posicion = posicion
		this.ancho = 64
		this.alto = 64
	}

	//Método para dibujar las cajas en el mapa.
	//Para ello uso el método "fillRect" que ofrece Canvas, que permite dibujar un rectángulo indicando 
	//el punto de partida y el tamaño.
	dibujar() {
		contexto.fillStyle = 'rgb(255, 0,0,0.0)'
		contexto.fillRect(this.posicion.x, this.posicion.y, this.ancho, this.alto)
	}
}