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

const material = new THREE.MeshStandardMaterial()

const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
planeMesh.rotation.x = -Math.PI / 2
planeMesh.position.y = -1

planeMesh.receiveShadow = true

const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)

cubeMesh.castShadow = true

scene.add(planeMesh, cubeMesh)

// 灯光
const ambientLight = new THREE.AmbientLight(0x404040, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 1, 0.5)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 4
directionalLight.shadow.camera.top = 1
directionalLight.shadow.camera.right = 1
directionalLight.shadow.camera.bottom = -1
directionalLight.shadow.camera.left = -1

scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera,
)

scene.add(directionalLightCameraHelper)

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

// 阴影
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

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

pane.addBinding(directionalLightCameraHelper, 'visible', {
  label: 'directionalLightCameraHelper visible',
})

pane.addBinding(renderer.shadowMap, 'type', {
  options: {
    BasicShadowMap: THREE.BasicShadowMap,
    PCFShadowMap: THREE.PCFShadowMap,
    PCFSoftShadowMap: THREE.PCFSoftShadowMap,
    VSMShadowMap: THREE.VSMShadowMap,
  },
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

  cubeMesh.rotation.y = elapsedTime

  cubeMesh.rotation.x = -elapsedTime / 5

  // 渲染
  orbitControls.update()

  renderer.render(scene, camera)

  // @ts-expect-error
  fpsGraph.end()
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)
