import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

const pane = new Pane()
pane.registerPlugin(EssentialsPlugin)

// 创建场景
const scene = new THREE.Scene()

const material = new THREE.MeshStandardMaterial({
  roughness: 0.2,
})

const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
planeMesh.rotation.x = -Math.PI / 2
planeMesh.position.y = -1

const torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(0.4, 0.2, 16, 32),
  material,
)
torusMesh.position.x = 1.5

const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material,
)
sphereMesh.position.x = -1.5

scene.add(planeMesh, torusMesh, cubeMesh, sphereMesh)

// 灯光
const ambientLight = new THREE.AmbientLight(0x404040, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 1, 0.5)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 1.5)
pointLight.position.set(1, 1, 1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(1, 0.1, 1)
rectAreaLight.lookAt(0, 0, 0)
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78ff00, 6, 8, Math.PI * 0.08, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

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

pane.addBinding(ambientLight, 'intensity', {
  label: 'ambientLight intensity',
  min: 0,
  max: 3,
  step: 0.01,
})

pane.addBinding(directionalLight, 'intensity', {
  label: 'directionalLight intensity',
  min: 0,
  max: 3,
  step: 0.01,
})

pane.addBinding(directionalLight.position, 'x', {
  label: 'directionalLight x',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(directionalLight.position, 'y', {
  label: 'directionalLight y',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(directionalLight.position, 'z', {
  label: 'directionalLight z',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(hemisphereLight, 'intensity', {
  label: 'hemisphereLight intensity',
  min: 0,
  max: 3,
  step: 0.01,
})

pane.addBinding(pointLight, 'intensity', {
  label: 'pointLight intensity',
  min: 0,
  max: 3,
  step: 0.01,
})

pane.addBinding(pointLight.position, 'x', {
  label: 'pointLight x',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(pointLight.position, 'y', {
  label: 'pointLight y',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(pointLight.position, 'z', {
  label: 'pointLight z',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(pointLight, 'distance', {
  label: 'pointLight distance',
  min: 0,
  max: 100,
  step: 0.01,
})

pane.addBinding(pointLight, 'decay', {
  label: 'pointLight decay',
  min: 0,
  max: 10,
  step: 0.01,
})

pane.addBinding(rectAreaLight, 'intensity', {
  label: 'rectAreaLight intensity',
  min: 0,
  max: 10,
  step: 0.01,
})

pane.addBinding(rectAreaLight.position, 'x', {
  label: 'rectAreaLight x',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(rectAreaLight.position, 'y', {
  label: 'rectAreaLight y',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(rectAreaLight.position, 'z', {
  label: 'rectAreaLight z',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(rectAreaLight, 'width', {
  label: 'rectAreaLight width',
  min: 0,
  max: 10,
  step: 0.01,
})

pane.addBinding(rectAreaLight, 'height', {
  label: 'rectAreaLight height',
  min: 0,
  max: 10,
  step: 0.01,
})

pane.addBinding(spotLight, 'intensity', {
  label: 'spotLight intensity',
  min: 0,
  max: 10,
  step: 0.01,
})

pane.addBinding(spotLight.position, 'x', {
  label: 'spotLight x',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(spotLight.position, 'y', {
  label: 'spotLight y',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(spotLight.position, 'z', {
  label: 'spotLight z',
  min: -10,
  max: 10,
  step: 0.01,
})

pane.addBinding(spotLight, 'distance', {
  label: 'spotLight distance',
  min: 0,
  max: 100,
  step: 0.01,
})

pane.addBinding(spotLight, 'decay', {
  label: 'spotLight decay',
  min: 0,
  max: 10,
  step: 0.01,
})

pane.addBinding(spotLight, 'penumbra', {
  label: 'spotLight penumbra',
  min: 0,
  max: 1,
  step: 0.01,
})

pane.addBinding(spotLight, 'angle', {
  label: 'spotLight angle',
  min: 0,
  max: Math.PI / 2,
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

  const elapsedTime = clock.getElapsedTime()

  torusMesh.rotation.y = elapsedTime
  cubeMesh.rotation.y = elapsedTime

  torusMesh.rotation.x = -elapsedTime / 5
  cubeMesh.rotation.x = -elapsedTime / 5

  // 渲染
  orbitControls.update()

  renderer.render(scene, camera)

  // @ts-expect-error
  fpsGraph.end()
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)
