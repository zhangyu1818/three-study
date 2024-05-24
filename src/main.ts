import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

const pane = new Pane()
pane.registerPlugin(EssentialsPlugin)

// 创建场景
const scene = new THREE.Scene()

const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.environment = environmentMap
  scene.background = environmentMap
})

// 创建材质
const material = new THREE.MeshPhysicalMaterial({
  transparent: true,
  roughness: 0,
})

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
sphere.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material,
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// 创建相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// 将相机添加到场景
scene.add(camera)

const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true

// 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
})

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

// Tweaks

pane.addBinding(material, 'metalness', {
  min: 0,
  max: 1,
  step: 0.01,
})

pane.addBinding(material, 'roughness', {
  min: 0,
  max: 1,
  step: 0.01,
})

pane.addBinding(material, 'iridescence', {
  min: 0,
  max: 1,
  step: 0.01,
})

pane.addBinding(material, 'iridescenceIOR', {
  min: 1,
  max: 2.33,
  step: 0.01,
})

pane.addBinding(material.iridescenceThicknessRange, '0', {
  label: 'iridescenceThicknessRange min',
  min: 0,
  max: 1000,
  step: 1,
})

pane.addBinding(material.iridescenceThicknessRange, '1', {
  label: 'iridescenceThicknessRange max',
  min: 0,
  max: 1000,
  step: 1,
})

pane.addBinding(material, 'clearcoat', {
  min: 0,
  max: 1,
  step: 0.01,
})

pane.addBinding(material, 'clearcoatRoughness', {
  min: 0,
  max: 1,
  step: 0.01,
})

pane.addBinding(material, 'transmission', {
  min: 0,
  max: 1,
  step: 0.01,
})

pane.addBinding(material, 'ior', {
  min: 1,
  max: 2.33,
  step: 0.01,
})

pane.addBinding(material, 'thickness', {
  min: 0,
  max: 1,
  step: 0.01,
})

const fpsGraph = pane.addBlade({
  view: 'fpsgraph',

  label: 'fpsgraph',
  rows: 2,
})

const clock = new THREE.Clock()

const tick = () => {
  // @ts-expect-error
  fpsGraph.begin()

  const elapsedTime = clock.getElapsedTime() / 5

  sphere.rotation.y = elapsedTime
  plane.rotation.y = elapsedTime
  torus.rotation.y = elapsedTime

  sphere.rotation.x = -elapsedTime
  plane.rotation.x = -elapsedTime
  torus.rotation.x = -elapsedTime

  // 渲染
  orbitControls.update()

  renderer.render(scene, camera)

  // @ts-expect-error
  fpsGraph.end()
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)
