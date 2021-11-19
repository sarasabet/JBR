import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios'


function App() {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const imageRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState([]);
  const [index, setIndex] =useState(-1)
  const [dogs, setDigs] = useState([])

  let draw_color = 'black'
  let start_background_color = 'white';


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 550;
    canvas.height = 400;
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
      setHistory(prev => [...prev,contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height) ])
      setIndex(prevIndex => prevIndex + 1)
     
    }
    console.log('initial index', index, history.length, history )

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

  function change_color ({nativeEvent}) {
    contextRef.current.strokeStyle = nativeEvent.target.style.background;
    draw_color = nativeEvent.target.style.background;
  }

  const pickColor = ({nativeEvent}) => {
    contextRef.current.strokeStyle = nativeEvent.target.value;
  }
  const pickBrushSize = ({nativeEvent}) => {
    contextRef.current.lineWidth = nativeEvent.target.value;
  }

  function SaveImage () {
    const imageFile = imageRef.current;
    imageFile.setAttribute('download', 'imge.png');
    imageFile.setAttribute('href', canvasRef.current.toDataURL())

  }

  function undoLast() {
    
    if (index <= -1) {
      return clearCanvas();          
    }
    console.log('1-undo: index, HL', index, history[index])
  
    contextRef.current.putImageData(history[index], 0,0);
    setIndex(prevIndex => prevIndex - 1)

    console.log('2-undo: index, HL', index, history.length)
  
  }

  function clearCanvas() {
    contextRef.current.fillStyle = start_background_color;
    contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
    setHistory([]);
    setIndex(-1);
  }

function redo() {

  if(index === history.length ){
    return;
  }  
 if (index < history.length && index > -1){

    contextRef.current.putImageData(history[index], 0,0);
    setIndex(prevIndex => prevIndex + 1)

  } 
  console.log('Redo: index, HL', index, history.length)
 
}

  return (
    <div className='fild'>
      <canvas id='canvas'
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      <div class='tools'>
        <div onClick={change_color} className='color-picker' style={{background: 'rgb(240, 15, 15)'}}></div>
        <div onClick={change_color} className='color-picker' style={{background: 'rgb(227, 230, 62)'}}></div>
        <div onClick={change_color} className='color-picker' style={{background: 'rgb(43, 31, 219)'}}></div>
        <div onClick={change_color} className='color-picker' style={{background: 'rgb(8, 158, 28)'}}></div>
        <input onInput={pickColor} type="color" className='color-picker' />
        <input onInput={pickBrushSize} type="range" min="1" max='100' className='pen_range' />    
      </div>
      <div>
        <button onClick={undoLast} type="button" className="button">Undo</button>
        <button onClick={clearCanvas} type="button" className="button">Clear</button>
        <button onClick={redo} type="button" className="button">Redo</button>
        <a href="#" onClick={SaveImage} ref={imageRef} download="imge.png">  Save Image</a>
      </div>
    </div>
  );
}

export default App;

