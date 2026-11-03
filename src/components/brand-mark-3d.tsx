"use client";

import { useEffect, useRef } from "react";
import type {
  BufferGeometry,
  Group,
  MeshStandardMaterial,
  Object3D,
  Shape,
  Texture,
  WebGLRenderer,
} from "three";
import { assetPath } from "@/lib/asset";
import { DEFAULT_BRAND_LOGO } from "./brand-context";

function mapX(x: number) {
  return (x - 32) / 32;
}

function mapY(y: number) {
  return (32 - y) / 32;
}

function roundedPlateShape(
  makeShape: new () => Shape,
  width: number,
  height: number,
  radius: number,
) {
  const shape = new makeShape();
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  return shape;
}

function fitObject(object: Object3D, THREE: typeof import("three"), target = 1.6) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const max = Math.max(size.x, size.y, size.z, 0.001);
  const scale = target / max;
  object.scale.setScalar(scale);
  box.setFromObject(object);
  const center = new THREE.Vector3();
  box.getCenter(center);
  object.position.sub(center);
}

export function BrandMark3D({
  className = "size-8",
  faceForward = false,
  logo = DEFAULT_BRAND_LOGO,
  modelUrl = "",
}: {
  className?: string;
  faceForward?: boolean;
  logo?: string;
  modelUrl?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceRef = useRef(faceForward);

  useEffect(() => {
    faceRef.current = faceForward;
  }, [faceForward]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stopped = false;
    let frame = 0;
    let renderer: WebGLRenderer | null = null;
    let root: Group | null = null;
    const materials: MeshStandardMaterial[] = [];
    const geometries: BufferGeometry[] = [];
    const textures: Texture[] = [];
    let removeResize: (() => void) | undefined;

    void (async () => {
      const THREE = await import("three");
      if (stopped || !canvasRef.current) return;

      const parent = canvas.parentElement;
      const size = Math.max(parent?.clientWidth || 32, parent?.clientHeight || 32, 32);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
      camera.position.set(0, 0.06, 3.2);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(size, size, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const ambient = new THREE.AmbientLight(0xffffff, 0.75);
      const key = new THREE.DirectionalLight(0xffffff, 1.2);
      key.position.set(2.2, 2.5, 3.4);
      const fill = new THREE.DirectionalLight(0xb0c4ff, 0.4);
      fill.position.set(-2.5, -0.8, 1.8);
      scene.add(ambient, key, fill);

      root = new THREE.Group();
      scene.add(root);

      const resolvedModel = modelUrl.trim() ? assetPath(modelUrl.trim()) : "";
      const resolvedLogo = assetPath(logo.trim() || DEFAULT_BRAND_LOGO);
      const useProcedural =
        !resolvedModel &&
        (logo.trim() === DEFAULT_BRAND_LOGO || logo.trim() === "" || logo.trim() === "/brand/mark.svg");

      if (resolvedModel) {
        const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
        if (stopped || !root) return;
        const gltf = await new GLTFLoader().loadAsync(resolvedModel);
        if (stopped || !root) return;
        fitObject(gltf.scene, THREE);
        root.add(gltf.scene);
      } else if (useProcedural) {
        const plateMat = new THREE.MeshStandardMaterial({
          color: 0x121212,
          metalness: 0.38,
          roughness: 0.4,
        });
        const inkMat = new THREE.MeshStandardMaterial({
          color: 0xfafaf8,
          metalness: 0.1,
          roughness: 0.32,
        });
        const accentMat = new THREE.MeshStandardMaterial({
          color: 0x3b82f6,
          metalness: 0.28,
          roughness: 0.26,
          emissive: 0x1d4ed8,
          emissiveIntensity: 0.28,
        });
        materials.push(plateMat, inkMat, accentMat);

        const plateShape = roundedPlateShape(THREE.Shape, 1.72, 1.72, 0.48);
        const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
          depth: 0.34,
          bevelEnabled: true,
          bevelThickness: 0.035,
          bevelSize: 0.035,
          bevelSegments: 3,
          curveSegments: 12,
        });
        plateGeo.translate(0, 0, -0.17);
        geometries.push(plateGeo);
        root.add(new THREE.Mesh(plateGeo, plateMat));

        const addStroke = (points: Array<[number, number]>, radius = 0.08) => {
          const vecs = points.map(
            ([x, y]) => new THREE.Vector3(mapX(x) * 1.45, mapY(y) * 1.45, 0.24),
          );
          const curve = new THREE.CatmullRomCurve3(vecs, false, "catmullrom", 0.02);
          const geo = new THREE.TubeGeometry(
            curve,
            Math.max(16, points.length * 10),
            radius,
            12,
            false,
          );
          geometries.push(geo);
          root?.add(new THREE.Mesh(geo, inkMat));
        };

        addStroke(
          [
            [18, 46],
            [32, 14],
            [46, 46],
          ],
          0.085,
        );
        addStroke(
          [
            [24.5, 36],
            [39.5, 36],
          ],
          0.085,
        );

        const dotGeo = new THREE.SphereGeometry(0.125, 28, 28);
        geometries.push(dotGeo);
        const dot = new THREE.Mesh(dotGeo, accentMat);
        dot.position.set(mapX(46) * 1.45, mapY(18) * 1.45, 0.3);
        root.add(dot);
      } else {
        const texture = await new THREE.TextureLoader().loadAsync(resolvedLogo);
        if (stopped || !root) return;
        texture.colorSpace = THREE.SRGBColorSpace;
        textures.push(texture);

        const plateMat = new THREE.MeshStandardMaterial({
          color: 0x121212,
          metalness: 0.3,
          roughness: 0.45,
        });
        const faceMat = new THREE.MeshStandardMaterial({
          map: texture,
          metalness: 0.08,
          roughness: 0.4,
        });
        materials.push(plateMat, faceMat);

        const plateShape = roundedPlateShape(THREE.Shape, 1.72, 1.72, 0.4);
        const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
          depth: 0.28,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.03,
          bevelSegments: 2,
          curveSegments: 10,
        });
        plateGeo.translate(0, 0, -0.14);
        geometries.push(plateGeo);
        root.add(new THREE.Mesh(plateGeo, plateMat));

        const faceGeo = new THREE.PlaneGeometry(1.5, 1.5);
        geometries.push(faceGeo);
        const face = new THREE.Mesh(faceGeo, faceMat);
        face.position.z = 0.15;
        root.add(face);
      }

      root.rotation.x = 0.2;

      const resize = () => {
        const next = Math.max(
          canvas.parentElement?.clientWidth || 32,
          canvas.parentElement?.clientHeight || 32,
          32,
        );
        renderer?.setSize(next, next, false);
      };
      window.addEventListener("resize", resize);
      removeResize = () => window.removeEventListener("resize", resize);

      let angle = 0.4;
      const draw = () => {
        if (stopped || !root || !renderer) return;
        if (faceRef.current) {
          root.rotation.y += (0 - root.rotation.y) * 0.14;
        } else {
          angle += 0.012;
          root.rotation.y = angle;
        }
        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      draw();
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      removeResize?.();
      geometries.forEach((geo) => geo.dispose());
      materials.forEach((mat) => mat.dispose());
      textures.forEach((tex) => tex.dispose());
      renderer?.dispose();
    };
  }, [logo, modelUrl]);

  return (
    <span className={`relative inline-flex shrink-0 overflow-visible ${className}`}>
      <canvas ref={canvasRef} className="block size-full" aria-hidden="true" />
    </span>
  );
}
