import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

let canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas
});
const texture = new THREE.TextureLoader();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const orbit = new OrbitControls(camera, renderer.domElement);

orbit.update();
camera.position.z = 3;


const map = texture.load('assets/2k_moon.jpg');
const cubegem = new THREE.SphereGeometry();
const cubemet = new THREE.MeshStandardMaterial({
    map: map,
    roughness: 0.2,
    metalness: 0.0,
    bumpMap: map,
    bumpScale: 8.0,
});
const cube = new THREE.Mesh(cubegem, cubemet);
scene.add(cube);


const light = new THREE.DirectionalLight(0xffffff, 5);
scene.add(light);
light.position.set(-6, 4, 3);


let rotationSpeed = 0.01;


const savedSettings = JSON.parse(localStorage.getItem('fnaf_scene_settings'));
if (savedSettings) {
    light.color.set(savedSettings.color);
    light.position.set(savedSettings.lightX, savedSettings.lightY, 3);
    cube.position.set(savedSettings.cubeX, savedSettings.cubeY, 0);
    cube.scale.set(savedSettings.scale, savedSettings.scale, savedSettings.scale);
    rotationSpeed = savedSettings.speed;
    if (savedSettings.bgColor) {
        scene.background = new THREE.Color(savedSettings.bgColor);
    }
}

// دالة التحديث الرسمية للعرض
function lose() {
    cube.rotation.y += rotationSpeed;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(lose);


// ==========================================
// لوحة التحكم وتخزين الإعدادات المحلي
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('mobile-control-btn');
  const closeBtn = document.getElementById('close-panel-btn');
  const controlPanel = document.getElementById('mobile-control-panel');

  const colorInput = document.getElementById('light-color');
  const bgColorInput = document.getElementById('bg-color');
  const lightPosXInput = document.getElementById('light-pos-x');
  const lightPosYInput = document.getElementById('light-pos-y');
  const moonPosXInput = document.getElementById('moon-pos-x');
  const moonPosYInput = document.getElementById('moon-pos-y');
  const scaleInput = document.getElementById('object-scale');
  const speedInput = document.getElementById('rotation-speed');
  const resetBtn = document.getElementById('reset-scene-btn');

  const defaultSettings = {
    color: '#ffffff',
    bgColor: '#000000',
    lightX: -6,
    lightY: 4,
    cubeX: 0,
    cubeY: 0,
    scale: 1,
    speed: 0.01
  };

  // ضبط قيم الـ Inputs الحالية
  if (colorInput) colorInput.value = '#' + light.color.getHexString();
  if (bgColorInput) {
    bgColorInput.value = scene.background ? '#' + scene.background.getHexString() : '#000000';
  }
  if (lightPosXInput) lightPosXInput.value = light.position.x;
  if (lightPosYInput) lightPosYInput.value = light.position.y;
  if (moonPosXInput) moonPosXInput.value = cube.position.x;
  if (moonPosYInput) moonPosYInput.value = cube.position.y;
  if (scaleInput) scaleInput.value = cube.scale.x;
  if (speedInput) speedInput.value = rotationSpeed;

  function saveToLocalStorage() {
    const currentSettings = {
      color: '#' + light.color.getHexString(),
      bgColor: scene.background ? '#' + scene.background.getHexString() : '#000000',
      lightX: light.position.x,
      lightY: light.position.y,
      cubeX: cube.position.x,
      cubeY: cube.position.y,
      scale: cube.scale.x,
      speed: rotationSpeed
    };
    localStorage.setItem('fnaf_scene_settings', JSON.stringify(currentSettings));
  }

  if (toggleBtn && controlPanel) {
    toggleBtn.addEventListener('click', () => {
      controlPanel.classList.add('active');
      toggleBtn.style.display = 'none';
    });
  }

  if (closeBtn && controlPanel && toggleBtn) {
    closeBtn.addEventListener('click', () => {
      controlPanel.classList.remove('active');
      toggleBtn.style.display = 'block';
    });
  }

  if (colorInput) {
    colorInput.addEventListener('input', (e) => {
      light.color.set(e.target.value);
      saveToLocalStorage();
    });
  }

  if (bgColorInput) {
    bgColorInput.addEventListener('input', (e) => {
      scene.background = new THREE.Color(e.target.value);
      saveToLocalStorage();
    });
  }

  if (lightPosXInput) {
    lightPosXInput.addEventListener('input', (e) => {
      light.position.x = parseFloat(e.target.value);
      saveToLocalStorage();
    });
  }

  if (lightPosYInput) {
    lightPosYInput.addEventListener('input', (e) => {
      light.position.y = parseFloat(e.target.value);
      saveToLocalStorage();
    });
  }

  if (moonPosXInput) {
    moonPosXInput.addEventListener('input', (e) => {
      cube.position.x = parseFloat(e.target.value);
      saveToLocalStorage();
    });
  }

  if (moonPosYInput) {
    moonPosYInput.addEventListener('input', (e) => {
      cube.position.y = parseFloat(e.target.value);
      saveToLocalStorage();
    });
  }

  if (scaleInput) {
    scaleInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      cube.scale.set(val, val, val);
      saveToLocalStorage();
    });
  }

  if (speedInput) {
    speedInput.addEventListener('input', (e) => {
      rotationSpeed = parseFloat(e.target.value);
      saveToLocalStorage();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      light.color.set(defaultSettings.color);
      scene.background = new THREE.Color(defaultSettings.bgColor);
      light.position.x = defaultSettings.lightX;
      light.position.y = defaultSettings.lightY;
      cube.position.x = defaultSettings.cubeX;
      cube.position.y = defaultSettings.cubeY;
      cube.scale.set(defaultSettings.scale, defaultSettings.scale, defaultSettings.scale);
      rotationSpeed = defaultSettings.speed;

      if (colorInput) colorInput.value = defaultSettings.color;
      if (bgColorInput) bgColorInput.value = defaultSettings.bgColor;
      if (lightPosXInput) lightPosXInput.value = defaultSettings.lightX;
      if (lightPosYInput) lightPosYInput.value = defaultSettings.lightY;
      if (moonPosXInput) moonPosXInput.value = defaultSettings.cubeX;
      if (moonPosYInput) moonPosYInput.value = defaultSettings.cubeY;
      if (scaleInput) scaleInput.value = defaultSettings.scale;
      if (speedInput) speedInput.value = defaultSettings.speed;

      localStorage.removeItem('fnaf_scene_settings');
    });
  }
});