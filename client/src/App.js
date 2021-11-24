import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios'


function App() {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const imageRef = useRef(null)
  const colorPickerRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState([]);
  const [index, setIndex] =useState(-1)
  const [dogs, setDigs] = useState([])
  const [counter, setCounter] = useState(1)

  let draw_color = 'black'
  let start_background_color = 'white';


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 550;
    canvas.height = 550;
    const context = canvas.getContext("2d")
    start_background_color = 'white';
    context.fillStyle = start_background_color
    // context.fillRect = (0,0, canvas.width, canvas.height)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 5
    contextRef.current = context;
    // const image = new Image()
    // image.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/183091/harper-coloring-book003.svg'
    // image.onload = function () {
    //     context.drawImage(
    //         image,
           
    //         0,
    //         0

    //     )
    // }
   
  }, [])
  useEffect(() => {
    // demo purposes hardcoded
    axios.get('http://localhost:3001/dogs')
    .then(res => {
      console.log(res);
    })
  }, [])
  

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
    // nativeEvent.preventDefault();
  }

  const finishDrawing = (nativeEvent) => {
    if(isDrawing){
      contextRef.current.stroke();
      contextRef.current.closePath()
      setIsDrawing(false)
    }   
    // nativeEvent.preventDefault();

    if (nativeEvent.type !== 'mouseout' ){
      //setHistory(prev => [...prev, index])
      setHistory(prev => [...prev,contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height) ])
      setIndex(prevIndex => prevIndex + 1)
      console.log('initial index', index, history.length, history )
    }
   

  }

  const draw = ({nativeEvent}) => {
    if(!isDrawing) {
      return
    }
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
    // nativeEvent.preventDefault();

  }
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function change_color ({nativeEvent}) {
    contextRef.current.strokeStyle = nativeEvent.target.style.background;
    draw_color = nativeEvent.target.style.background;
    console.log('val', nativeEvent.target.style.background)
    const back_color =  nativeEvent.target.style.background;
    const color = back_color.substr(4,back_color.length-5);
    const rgb = color.split(',')
    const rgbObj = rgbToHex(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]))
    console.log('color', rgbObj)
    colorPickerRef.current.value = rgbObj;
    console.log('val', colorPickerRef.current.value)
  }

  const pickColor = ({nativeEvent}) => {
    contextRef.current.strokeStyle = nativeEvent.target.value;
  }
  const pickBrushSize = ({nativeEvent}) => {
    const value = nativeEvent.target.style.height;
    const size = Number(value.slice(0,value.length-2))
    contextRef.current.lineWidth = size;
  }

  function SaveImage () {
    const imageFile = imageRef.current;
    imageFile.setAttribute('download', 'imge.png');
    imageFile.setAttribute('href', canvasRef.current.toDataURL())

  }

  function undoLast() {

    if (index <= 0) {
       contextRef.current.fillStyle = start_background_color;
       contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);  
       setIndex(-1)
       return      
    }
    
    contextRef.current.putImageData(history[index - 1], 0,0);
    setIndex(prevIndex => prevIndex - 1)
  
  }

  function clearCanvas() {
    contextRef.current.fillStyle = start_background_color;
    contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
    setHistory([]);
    setIndex(-1);
  }

function redo() {

  if(index >= history.length - 1){
    return;
  }  

  contextRef.current.putImageData(history[index + 1], 0,0);
  setIndex(prevIndex => prevIndex + 1)
 
}

  return (
    <div className="logo">
    
    <img src="bob-ross.png" alt='bob-ross.jpeg' style={{height:'200px' , width: '400px'}} />
    <img src="pallete.jpeg" style={{height:'100px' , width: '100px'}}/>
    <div className='fild'>
        <div className='canvas-pallete'>
          <div className='tools'>
            <div>
              <div onClick={change_color} className='color-picker' style={{background: '#778899'}}></div>
              <div onClick={change_color} className='color-picker' style={{background: '#B0C4DE'}}></div>
            </div>
            <div>
              <div onClick={change_color} className='color-picker' style={{background: 'cyan'}}></div>
              <div onClick={change_color} className='color-picker' style={{background: 'rgb(8, 158, 28)'}}></div>   
            </div>
            <div>
              <div onClick={change_color} className='color-picker' style={{background: 'purple'}}></div>
              <div onClick={change_color} className='color-picker' style={{background: 'pink'}}></div>
            </div>
            <div>
              <div onClick={change_color} className='color-picker' style={{background: 'brown'}}></div>
              <div onClick={change_color} className='color-picker' style={{background: 'deepPink'}}></div>     
            </div>
            <div>
              <div>
                <div onClick={change_color} className='color-picker' style={{background: 'darkGrey'}}></div>
                <div onClick={change_color} className='color-picker' style={{background: 'orange'}}></div>
              </div>
              <div>
                <div onClick={change_color} className='color-picker' style={{background: 'rgb(43, 31, 219)'}}></div>
                <div onClick={change_color} className='color-picker' style={{background: 'lightGreen'}}></div>
              </div>
              <div>
                <div onClick={change_color} className='color-picker' style={{background: 'red'}}></div>
                <div onClick={change_color} className='color-picker' style={{background: 'magenta'}}></div>
              </div>
              <div>
                <div onClick={change_color} className='color-picker' style={{background: 'beige'}}></div>
                <div onClick={change_color} className='color-picker' style={{background: 'indigo'}}></div>   
              </div>
            </div>
            <input onInput={pickColor} type="color" className='color-picker' value="#ff00ff"  ref={colorPickerRef} style={{height: '50px', width:'50px'}}/>
            <div className="brush">
              <div onClick={pickBrushSize} style={{backgroundColor: 'white', height:'20px', width: '40px', marginBottom: '.5em'}}></div>
              <div onClick={pickBrushSize} style={{backgroundColor: 'white', height:'15px', width: '40px', marginBottom: '.5em'}}></div>
              <div onClick={pickBrushSize} style={{backgroundColor:'white', height:'10px', width: '40px',  marginBottom: '.5em'}}></div>
              <div onClick={pickBrushSize} style={{backgroundColor:'white', height:'5px', width: '40px',  marginBottom: '.5em'}}></div>
              <div onClick={pickBrushSize} style={{backgroundColor:'white', height:'3px', width: '40px'}}></div>
            </div>
          </div>
          <canvas id='canvas'
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseOut={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
          />
        </div>
        <div>

          <input onInput={pickBrushSize} type="range" min="1" max='100' className='pen_range' />    
        </div>
        <div>
          <button onClick={undoLast} type="button" className="button">Undo</button>
          <button onClick={clearCanvas} type="button" className="button">Clear</button>
          <button onClick={redo} type="button" className="button">Redo</button>
          <a href="#" onClick={SaveImage} ref={imageRef} download="imge.png">  Save Image</a>
        </div>
      </div>
    </div>
  );
}

export default App;