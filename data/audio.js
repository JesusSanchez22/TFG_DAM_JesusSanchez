//Clase que contiene la información sobre las pistas de audio que usaré.
//Para ello uso la librería "Howler" que importo en "index.html".
const audio = {	//Objeto que contiene múltiples objetos con la información sobre el audio.
	mapa: new Howl({
		src: "./audio/musicaMapa.wav",	//Ruta del audio.
		html5: true,	//Propiedad para que sea compatible con HTML.
		volume: 0.1	//Volumen.
	}),
	iniciarBatalla: new Howl({
		src: "./audio/iniciarBatalla.wav",
		html5: true,
		volume: 0.1
	}),
	batalla: new Howl({
		src: "./audio/musicaBatalla.mp3",
		html5: true,
		volume: 0.1
	}),
	placaje: new Howl({
		src: "./audio/sonidoPlacaje.wav",
		html5: true,
		volume: 0.1
	}),
	ascuasInicio: new Howl({
		src: "./audio/sonidoAscuas.wav",
		html5: true,
		volume: 0.1
	}),
	ascuasGolpe: new Howl({
		src: "./audio/golpeAscuas.wav",
		html5: true,
		volume: 0.1
	}),
	victoria: new Howl({
		src: "./audio/musicaVictoria.wav",
		html5: true,
		volume: 1
	}),
}