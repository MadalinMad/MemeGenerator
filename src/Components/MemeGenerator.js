import React from "react"

class MemeGenerator extends React.Component{
	constructor(){
		super()
		this.state ={
				topText : "",
				bottomText : "",
				allMemeImg: {},
				randomImg:"http://i.imgflip.com/1bij.jpg",
				mouseDownOn: "",
				data: {}
		}
		this.showState = this.showState.bind(this)
		this.validateInput = this.validateInput.bind(this)
		this.generateMeme = this.generateMeme.bind(this)
		this.textMouseDown = this.textMouseDown.bind(this)
		this.textMouseUp = this.textMouseUp.bind(this)
		this.draggingOver = this.draggingOver.bind(this)
		this.droppingItem = this.droppingItem.bind(this)
		this.pickImage = this.pickImage.bind(this)
	}
	componentDidMount(){
		fetch('https://api.imgflip.com/get_memes')
		.then(response =>response.json())
		.then(data => {
			this.setState(prevState => {
				let newState = JSON.parse(JSON.stringify(prevState))
				newState.allMemeImg = data.data.memes
				newState.data  =data.data
				console.log(newState)
				return newState
			})
		})
	}
	showState(){
		console.log(this.state)
	}

	validateInput(event){
		const {name, value} = event.target	
		this.setState(prevState => {
			let newState = JSON.parse(JSON.stringify(prevState))
			newState.[name] = value
			console.log(newState.[name])
			return newState
		}) 
	}
	generateMeme(event){
		console.log("meme generated")
		const newImageIndex = Math.floor(Math.random() * this.state.allMemeImg.length)
		this.setState(prevState => {
			let newState = JSON.parse(JSON.stringify(prevState))
			newState.randomImg = newState.allMemeImg[newImageIndex].url
			return newState
		})
		event.preventDefault()
	}

	textMouseDown(event){
		this.setState(prevState =>{
			let newState = JSON.parse(JSON.stringify(prevState))
			newState.mouseDownOn  = event.target.id
			return newState	
		})
	}

	textMouseUp(){
		this.setState(prevState =>{
			let newState = JSON.parse(JSON.stringify(prevState))
			newState.mouseDownOn  = null
			console.log(newState.mouseDownOn)
			return newState	
		})
	}

	draggingOver(event){
			event.preventDefault()
		if (this.state.mouseDownOn !== "" && this.state.mouseDownOn !== null) {
			let filmContainer = document.getElementById("mad-text-film").getBoundingClientRect()
			let relativeX = event.clientX - filmContainer.left
			let relativeY = event.clientY - filmContainer.top
			let elmentToMove = document.getElementById(this.state.mouseDownOn)
			event.target.style.cursor = "pointer"
			elmentToMove.style.top = (relativeY - 28) +"px" 
			elmentToMove.style.left = relativeX + "px"

		}

	}

	droppingItem(event){
		this.setState(prevState =>{
			let newState = JSON.parse(JSON.stringify(prevState))
			newState.mouseDownOn  = null
			// console.log(newState.mouseDownOn)
			return newState	
		})

	}

	pickImage(event){
		console.log(event.target)
		const newImageIndex = Math.floor(Math.random() * this.state.allMemeImg.length)
		this.setState(prevState => {
			let newState = JSON.parse(JSON.stringify(prevState))
			newState.randomImg =  newState.allMemeImg[event.target.id].url
			return newState
		})
	}


	render(){
	// const images = this.state.data.map(meme => <div> meme.url</div>)
	let images = []
	for (let i = 0; i < this.state.allMemeImg.length; i++){
	
		let imgStyle = {
			backgroundImage : `url(${this.state.allMemeImg[i].url})`,
		}
		images.push(<div className="mad-image-item" id={i} onClick={this.pickImage} style={imgStyle} key={this.state.allMemeImg[i].id} ></div>)
	}


		return(

				<div >
				
					<form className="mad-meme-generator" onSubmit={this.generateMeme}>
						<input placeholder="text here " value={this.state.topText} onChange={this.validateInput} type="text" name="topText" />
						<input placeholder="text here " value={this.state.bottomText} onChange={this.validateInput} type="text" name="bottomText" />
						<button>Random image</button>
					</form>
					
					<div className="mad-image-picker">
				
					{images}
					</div>
					<div className="mad-meme-generated" >
						<img src={this.state.randomImg} alt="This meme was not found mlml"/>
						<div className="mad-text-film" id="mad-text-film" onDragOver={event => this.draggingOver(event)} onDrop={event => this.droppingItem(event)}> 
							<h2 id="text1" onMouseDown={this.textMouseDown}  onMouseUp={this.textMouseUp} draggable className="top">{this.state.topText}</h2>
							<h2 id="text2" onMouseDown={this.textMouseDown}  onMouseUp={this.textMouseUp} draggable className="bottom">{this.state.bottomText}</h2>
						</div>
					</div>

				</div>
			)
	}
}

export default MemeGenerator