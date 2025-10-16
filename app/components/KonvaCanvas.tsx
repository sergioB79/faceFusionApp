'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image, Line, Rect } from 'react-konva';
import useImage from 'use-image';

interface KonvaCanvasProps {
  imageSrc: string;
  lineOrientation: 'horizontal' | 'vertical';
  sideToKeep: 'top' | 'bottom' | 'left' | 'right';
}

const KonvaCanvas = forwardRef<any, KonvaCanvasProps>(({ imageSrc, lineOrientation, sideToKeep }, ref) => {
  const [image] = useImage(imageSrc);
  const [horizontalLineY, setHorizontalLineY] = useState(200);
  const [verticalLineX, setVerticalLineX] = useState(224);

  useImperativeHandle(ref, () => ({
    getLinePosition: () => {
      if (lineOrientation === 'horizontal') {
        return { y: horizontalLineY };
      } else {
        return { x: verticalLineX };
      }
    },
    getStage: () => {
      return ref.current!;
    }
  }));

  const getRemovedArea = () => {
    if (lineOrientation === 'horizontal') {
      if (sideToKeep === 'top') {
        return { x: 0, y: horizontalLineY, width: 448, height: 384 - horizontalLineY };
      } else {
        return { x: 0, y: 0, width: 448, height: horizontalLineY };
      }
    } else {
      if (sideToKeep === 'left') {
        return { x: verticalLineX, y: 0, width: 448 - verticalLineX, height: 384 };
      } else {
        return { x: 0, y: 0, width: verticalLineX, height: 384 };
      }
    }
  };

  const removedArea = getRemovedArea();

  return (
    <Stage ref={ref} width={448} height={384}>
      <Layer>
        {image && <Image image={image} width={448} height={384} />}
        <Rect
          {...removedArea}
          fill="black"
          opacity={0.5}
        />
        {lineOrientation === 'horizontal' ? (
          <Line
            points={[0, horizontalLineY, 448, horizontalLineY]}
            stroke="red"
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              const { y } = e.target.position();
              setHorizontalLineY(y);
            }}
            dragBoundFunc={(pos) => {
              return {
                x: 0,
                y: pos.y,
              };
            }}
          />
        ) : (
          <Line
            points={[verticalLineX, 0, verticalLineX, 384]}
            stroke="red"
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              const { x } = e.target.position();
              setVerticalLineX(x);
            }}
            dragBoundFunc={(pos) => {
              return {
                x: pos.x,
                y: 0,
              };
            }}
          />
        )}
      </Layer>
    </Stage>
  );
});

KonvaCanvas.displayName = 'KonvaCanvas';


export default KonvaCanvas;
