import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

const pane = new Pane()
pane.registerPlugin(EssentialsPlugin)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// 创建场景
const scene = new THREE.Scene()

// 环境贴图
// Cube Texture
// const cubeTextureLoader = new THREE.CubeTextureLoader()
//
// const cubeTexture = cubeTextureLoader.load([
//   '/environmentMaps/2/px.png',
//   '/environmentMaps/2/nx.png',
//   '/environmentMaps/2/py.png',
//   '/environmentMaps/2/ny.png',
//   '/environmentMaps/2/pz.png',
//   '/environmentMaps/2/nz.png',
// ])
//
// scene.background = cubeTexture
// scene.environment = cubeTexture

// HDR

// const rgbelLoader = new RGBELoader()
// rgbelLoader.load('/environmentMaps/2/2k.hdr', (texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping
//
//   scene.background = texture
//   scene.environment = texture
// })

const texture = new THREE.TextureLoader().load(
  '/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg',
)
texture.mapping = THREE.EquirectangularReflectionMapping
texture.colorSpace = THREE.DisplayP3ColorSpace
scene.background = texture
// scene.environment = texture

scene.environmentIntensity = 2

const gltfLoader = new GLTFLoader()

gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(5, 5, 5)
  gltf.scene.position.x = 1
  gltf.scene.position.y = -1.5
  scene.add(gltf.scene)
})

const torusKnotMesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
  new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0,
  }),
)
torusKnotMesh.position.x = -2
scene.add(torusKnotMesh)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(6, 0.4),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
  }),
)
torus.layers.enable(1)
torus.position.y = 0.8
scene.add(torus)

// 创建相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 2
camera.position.z = 4
// 将相机添加到场景
scene.add(camera)

const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true

// 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
})

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType,
})

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)
scene.environment = cubeRenderTarget.texture

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// 设置渲染器大小
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const timer = new Timer()

const tick = (timestamp: number) => {
  // @ts-expect-error
  fpsGraph.begin()

  const elapsedTime = timer.getElapsed()

  torus.rotation.x = elapsedTime
  cubeCamera.update(renderer, scene)

  // 渲染
  orbitControls.update()

  requestAnimationFrame(tick)
  timer.update(timestamp)

  renderer.render(scene, camera)

  // @ts-expect-error
  fpsGraph.end()
}

requestAnimationFrame(tick)

pane.addBinding(scene, 'environmentIntensity', {
  min: 0,
  max: 10,
  step: 0.01,
})

pane.addBinding(scene, 'backgroundIntensity', {
  min: 0,
  max: 10,
  step: 0.01,
})

pane.addBinding(scene, 'backgroundBlurriness', {
  min: 0,
  max: 1,
  step: 0.01,
})

pane.addBinding(scene.environmentRotation, 'y', {
  label: 'environmentRotation.y',
  min: 0,
  max: Math.PI * 2,
  step: 0.01,
})

pane.addBinding(scene.backgroundRotation, 'y', {
  label: 'backgroundRotation.y',
  min: 0,
  max: Math.PI * 2,
  step: 0.01,
})

const fpsGraph = pane.addBlade({
  view: 'fpsgraph',

  label: 'FPS',
  rows: 2,
})
