"use client";

import { useState, useRef } from 'react';

import KonvaCanvas from './components/KonvaCanvas';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [lineOrientation, setLineOrientation] = useState('horizontal');
  const [sideToKeep, setSideToKeep] = useState('top');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (stageRef.current) {
      const stage = stageRef.current.getStage();
      const linePosition = stageRef.current.getLinePosition();

      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = stage.width();
      maskCanvas.height = stage.height();
      const maskCtx = maskCanvas.getContext('2d');

      if (maskCtx) {
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.fillStyle = 'white';

        if (lineOrientation === 'horizontal') {
          if (sideToKeep === 'top') {
            maskCtx.fillRect(0, linePosition.y, maskCanvas.width, maskCanvas.height - linePosition.y);
          } else {
            maskCtx.fillRect(0, 0, maskCanvas.width, linePosition.y);
          }
        } else {
          if (sideToKeep === 'left') {
            maskCtx.fillRect(linePosition.x, 0, maskCanvas.width - linePosition.x, maskCanvas.height);
          } else {
            maskCtx.fillRect(0, 0, linePosition.x, maskCanvas.height);
          }
        }
      }

      const mask = maskCanvas.toDataURL();
      const image = stage.toDataURL();

      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, mask }),
      });

      const data = await response.json();
      setGeneratedImage(data.image);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="p-4 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-magenta-500 to-cyan-500"></div>
        <div className="text-2xl font-bold bg-gradient-to-r from-magenta-500 to-cyan-500 bg-clip-text text-transparent">FaceFusion.AI</div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md h-96 bg-gray-800 rounded-lg flex items-center justify-center relative">
          {image ? (
            <KonvaCanvas ref={stageRef} imageSrc={image} lineOrientation={lineOrientation} sideToKeep={sideToKeep} />
          ) : (
            <p className="text-gray-500">[Split Canvas Placeholder]</p>
          )}
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setLineOrientation('horizontal')}
            className={`${lineOrientation === 'horizontal' ? 'bg-cyan-500' : 'bg-gray-700'} text-white font-bold py-2 px-4 rounded`}
          >
            Horizontal
          </button>
          <button
            onClick={() => setLineOrientation('vertical')}
            className={`${lineOrientation === 'vertical' ? 'bg-cyan-500' : 'bg-gray-700'} text-white font-bold py-2 px-4 rounded`}
          >
            Vertical
          </button>
        </div>
        {lineOrientation === 'horizontal' ? (
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setSideToKeep('top')}
              className={`${sideToKeep === 'top' ? 'bg-cyan-500' : 'bg-gray-700'} text-white font-bold py-2 px-4 rounded`}
            >
              Keep Top
            </button>
            <button
              onClick={() => setSideToKeep('bottom')}
              className={`${sideToKeep === 'bottom' ? 'bg-cyan-500' : 'bg-gray-700'} text-white font-bold py-2 px-4 rounded`}
            >
              Keep Bottom
            </button>
          </div>
        ) : (
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setSideToKeep('left')}
              className={`${sideToKeep === 'left' ? 'bg-cyan-500' : 'bg-gray-700'} text-white font-bold py-2 px-4 rounded`}
            >
              Keep Left
            </button>
            <button
              onClick={() => setSideToKeep('right')}
              className={`${sideToKeep === 'right' ? 'bg-cyan-500' : 'bg-gray-700'} text-white font-bold py-2 px-4 rounded`}
            >
              Keep Right
            </button>
          </div>
        )}
        <div className="mt-4">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-magenta-500 to-cyan-500 text-white font-bold py-2 px-4 rounded"
          >
            Upload Image
          </button>
          <button
            onClick={handleGenerate}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Generate
          </button>
        </div>
        {generatedImage && (
          <div className="mt-4">
            <img src={generatedImage} alt="Generated" className="max-w-full max-h-full" />
          </div>
        )}
      </main>
    </div>
  );
}

