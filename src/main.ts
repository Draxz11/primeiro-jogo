import { Actor, CollisionType, Color, Engine, Font, FontUnit, Label, Loader, Sound, Text, vec } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo
const game = new Engine({
	width: 800,
	height: 600,
})

// 2 - Criar a barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40, // game.drawHeight =  altura do canvas
	width: 200,
	height: 20,
	color: Color.Chartreuse
})


// Define o tipo de colisão da barra
// CollisionType = significa que ele não irá se "mexer" quando colidir
barra.body.collisionType = CollisionType.Fixed

// Insere o Actor barra - player, no game
game.add(barra)

// 3 - Movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	barra.pos.x = event.worldPos.x
})

// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.White
})

bolinha.body.collisionType = CollisionType.Passive

// Lista de cores 
let coresBolinha = [
	Color.Black,
	Color.Chartreuse,
	Color.Cyan,
	Color.Green,
	Color.Magenta,
	Color.Orange,
	Color.Red,
	Color.Rose,
	Color.White,
	Color.Yellow
]

let numerCores = coresBolinha.length

// 5 - Criar movimentação da bolinha
const velocidadeBolinha = vec(800, 800)

// Após q segundo (1000 ms), define a velocidade da bolinha em x = 100 e y = 100
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

// 6 - Fazer bolinha bater na parede
bolinha.on("postupdate", () => {
	// se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}

	// se a bolinha colidir com o lado direito
	if (bolinha.pos.x  + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x
	}

	// se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) [
		bolinha.vel.y = velocidadeBolinha.y
	]
	
	// se a bolinha colidir com a parte inferior
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	bolinha.vel.y = -velocidadeBolinha.y
	// }

})

const win = new Sound ('./src/efeitos/win.wav')
const die = new Sound ('./src/efeitos/gameover.wav')
const somPunch = new Sound  ('./src/efeitos/punch.wav');
const loader = new Loader([somPunch, die, win]);




// Insere bolinha no game
game.add(bolinha)


// 7 - Criar os blocos
// Configurações de tamanho e espaçamento dos blocos
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Renderização dos bloquinhos

// Renderiza 3 linhas
for(let j = 0; j < linhas; j++) {

	// Renderiza 5 bloquinhos
	for(let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}
}

listaBlocos.forEach( bloco => {
	// Define o tipo de colisor de cada bloco
	bloco.body.collisionType = CollisionType.Active

	// Adiciona cada bloco no game
	game.add(bloco)
})


// Adicionando pontução
let pontos = 0

const textoPontos = new Label({
	text: pontos.toString(),
	font: new Font({
		size: 40,
		color: Color.White,
		strokeColor: Color.Black,
		unit: FontUnit.Px
	}),
	pos: vec(600, 500)
})


game.add(textoPontos)

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
	// verificar se a bolinha colidiu com algum bloco destrutível
	// se o elemento colidido for um bloco da losta de blocos (destrutível)
	if ( listaBlocos.includes(event.other) ) {
		// Destruir o bloco colidido
		event.other.kill()

		// Adiciona um ponto
		pontos++

		// Atualiza valor do placar - textoPontos
		textoPontos.text = pontos.toString()

		// Executar o Som
		somPunch.play(1)

		// Mudar a cor da bolinha
		bolinha.color= coresBolinha[ Math.trunc (Math.random() * numerCores) ]

		// Math.trunc() - retorna somente a porção inteira de um número

		bolinha.color = event.other.color

	}

	


	// Rebater a bolinha - inverter as direções
	// "minimum translation vaector" is a vector 'normalize()'
	let interseccao = event.contact.mtv.normalize()

	// Se não está colidindo
	// !colidindo mesma coisa que colidindo == false
	if(!colidindo) {
		colidindo = true

		// interseccao.x e interseccao.y
		// o maior representa o eixo onde houve contato
		if ( Math.abs(interseccao.x)  > Math.abs(interseccao.y)) {
			// bolinha.vel.x = -bolinha.vel.x
			// bolinha.vel.x = -1
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			// bolinha.vel.y = -bolinha.vel.y
			// bolinha.vel.y = -1
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}
})

bolinha.on("collisionend", () => {
	colidindo = false
	if( pontos == 15) {
		win.play(1)
		alert("Parabéns, você conseguiu👌")
		window.location.reload()
		
	} 
})

bolinha.on("exitviewport", () => {
	die.play(1)
	alert("Game over😞, tente novamente")
	window.location.reload()
})

// Inicia o game
await game.start(loader)