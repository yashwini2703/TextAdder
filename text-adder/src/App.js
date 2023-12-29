import React, { useState, useRef } from 'react';
import './App.css';

const App = () => {
  const [texts, setTexts] = useState([]);
  const [fontStyle, setFontStyle] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const [newText, setNewText] = useState('');
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  let isDragging = false;
  const handleAddText = () => {
    if (newText.trim() !== '') {
      const newTextObj = { text: newText, position: { x: 0, y: 0 } };
      setTexts((prevTexts) => [...prevTexts, newTextObj]);
  
      
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push([...texts, newTextObj]);
      historyIndexRef.current += 1;
  
      setNewText(''); // Clear the text area after adding text
    }
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setTexts(historyRef.current[historyIndexRef.current]);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setTexts(historyRef.current[historyIndexRef.current]);
    }
  };

  const handleDragMove = (e, index) => {
    if (!isDragging) {
      return;
    }

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    setTexts((prevTexts) =>
      prevTexts.map((text, i) => {
        if (i === index) {
          const newPosition = {
            x: Math.min(Math.max(text.position.x + deltaX, 0), 500 - 20), 
            y: Math.min(Math.max(text.position.y + deltaY, 0), 500 - 20), 
          };
          return { ...text, position: newPosition };
        } else {
          return text;
        }
      })
    );

    startX = e.clientX;
    startY = e.clientY;
  };

  const handleFontStyleChange = (e) => {
    setFontStyle(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(Number(e.target.value));
  };

  const handleFontColorChange = (e) => {
    setFontColor(e.target.value);
  };

  let startX, startY;

  const handleDragStart = (e, index) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    document.addEventListener('mousemove', (event) => handleDragMove(event, index));
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragEnd = () => {
    isDragging = false;

    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push([...texts]);
    historyIndexRef.current += 1;

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center',border:'1px solid black' ,alignItems: 'center', height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #000',
          width: '500px',
          height: '500px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {texts.map((textObj, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${textObj.position.x}px`,
              top: `${textObj.position.y}px`,
              cursor: 'pointer',
              fontFamily: fontStyle,
              fontSize: `${fontSize}px`,
              color: fontColor,
            }}
            onMouseDown={(e) => handleDragStart(e, index)}
          >
            {textObj.text}
          </div>
        ))}
      </div>
<div style={{position: 'absolute',top: '0', left: '0'}}>
      <button style={{marginRight:'5px'}} onClick={handleUndo} disabled={historyIndexRef.current === 0}>
            Undo
          </button>
          <button onClick={handleRedo} disabled={historyIndexRef.current === historyRef.current.length - 1}>
            Redo
          </button></div>

      <div style={{ marginTop: '10px', marginLeft: '10%', display: 'flex', flexDirection: 'column' }}>
       
        <div style={{ width: '100px', marginBottom: '5px' }}>
          <label>Font:</label>
          <select value={fontStyle} onChange={handleFontStyleChange}>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
        <div style={{ width: '100px', marginBottom: '5px' }}>
          <label style={{ display: 'block', float: 'left' }}> Size:</label>
          <input
            type="number"
            style={{ width: '50px', textAlign: 'center', alignItems: 'center' }}
            value={fontSize}
            onChange={handleFontSizeChange}
          />
        </div>
        <div style={{ width: '100px', marginBottom: '20px' }}>
          <label style={{ display: 'block', float: 'left' }}>Color:</label>
          <input
            type="color"
            style={{ width: '50px', textAlign: 'center', alignItems: 'center' }}
            value={fontColor}
            onChange={handleFontColorChange}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <textarea
          placeholder="New Text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          style={{ marginBottom: '10px', height: '50px', resize: 'none' }}
        /></div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <button onClick={handleAddText}>Add Text</button>
          </div>
        </div>
      </div>
    
  );
};

export default App;
