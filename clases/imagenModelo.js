
//Clase "ImagenModelo" que usaré de molde para crar imágenes.
class ImagenModelo {

	//Constructor con parámetros.
	constructor({ 
		posicion, 
		imagen, 
		frames = { numero: 1, velocidad: 20 }, 
		sprites, 
		animado = false, 
	}){
		this.posicion = posicion
		this.imagen = new Image()
		this.frames = {...frames, val: 0, recorrido: 0}

		this.imagen.onload = () => {	//Método que espera a que la imagen cargue para ejecutar el código del interior.
			this.ancho = this.imagen.width / this.frames.numero
			this.alto = this.imagen.height
		}

		this.imagen.src = imagen.src
		this.animado = animado
		this.sprites = sprites
		this.opacity = 1
	}

	//Método dibujar para mostrar la imagen.
	dibujar() {
		contexto.save()
		contexto.globalAlpha = this.opacity
		
		//En este método haremos toda la funcionalidad con respecto a "recortar" la imagen.
		contexto.drawImage(
			this.imagen, //referencia a la imagen
			this.frames.val * this.ancho, 0, //posición x,y en la propia imagen
			this.imagen.width / this.frames.numero, this.imagen.height, //ancho y alto en la propia imagen
			this.posicion.x, this.posicion.y, //posición x,y de la imagen en el canvas
			this.imagen.width /this.frames.numero, this.imagen.height //alto y ancho de la imagen
		) 
		contexto.restore()

		if(this.animado){
			if(this.frames.numero > 1){
				this.frames.recorrido++
			}

			if(this.frames.recorrido % this.frames.velocidad === 0){
				if(this.frames.val < this.frames.numero - 1){ 
					this.frames.val++
				}else{
					this.frames.val = 0
				}
			}

		} else{
			this.frames.val = 0
		}
	}

}
