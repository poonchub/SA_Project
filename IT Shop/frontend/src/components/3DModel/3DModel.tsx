// components/My3DModel.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PivotControls, useGLTF } from '@react-three/drei';

interface ModelProps {
    isDragging: boolean;
}

const Model: React.FC<ModelProps> = ({ isDragging }) => {
    const { scene } = useGLTF('./3D-Model/asus_rog.glb');
    const modelRef = useRef();

    useFrame(() => {
        if (!isDragging && modelRef.current) {
            // @ts-ignore
            modelRef.current.rotation.y += 0.007;
        }
    });

    return (
        <PivotControls anchor={[0, -0.5, -0.3]} scale={0}>
            <primitive
                ref={modelRef}
                object={scene}
                scale={[1.4, 1.4, 1.4]}
                rotation={[0.4, 0, 0]}
                position={[0, -4.1, -3]}
            />
        </PivotControls>
    );
};

const My3DModel = () => {
    const [isDragging, setIsDragging] = React.useState(false);

    return (
        <Canvas gl={{ alpha: true }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
        >
            <ambientLight intensity={5} />
            <directionalLight position={[10, 10, 5]} intensity={3} />
            <Model isDragging={isDragging} />
            <OrbitControls />
        </Canvas>
    );
};

export default My3DModel;
