import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

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

let mixer: THREE.AnimationMixer | null = null

// 加载模型
const gltfLoader = new GLTFLoader()
const dracLoader = new DRACOLoader()

dracLoader.setDecoderPath('node_modules/three/examples/jsm/libs/draco/')

gltfLoader.setDRACOLoader(dracLoader)
gltfLoader.load('/models/Duck/glTF/Duck.gltf', (gltf) => {
  scene.add(gltf.scene.children[0])
})

gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
  gltf.scene.children[0].position.x = 2
  scene.add(gltf.scene.children[0])
})

gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
  const fox = gltf.scene.children[0]
  fox.scale.set(0.02, 0.02, 0.02)
  fox.position.x = -2
  scene.add(fox)

  mixer = new THREE.AnimationMixer(fox)
  const action = mixer.clipAction(gltf.animations[0])
  action.play()
})

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x777777,
    side: THREE.DoubleSide,
  }),
)
planeMesh.rotation.x = Math.PI / 2
scene.add(planeMesh)

// 创建相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(5, 5, 5)
// 将相机添加到场景
scene.add(camera)

const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true

// 灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0x78ff00, 8, 8, Math.PI * 0.2, 0.5, 1)
spotLight.position.set(0, 3, 2)
scene.add(spotLight)

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

const fpsGraph = pane.addBlade({
  view: 'fpsgraph',

  label: 'FPS',
  rows: 2,
})

const timer = new Timer()

const tick = (timestamp: number) => {
  // @ts-expect-error
  fpsGraph.begin()

  // 渲染
  orbitControls.update()

  requestAnimationFrame(tick)
  timer.update(timestamp)

  const delta = timer.getDelta()
  if (mixer) {
    mixer.update(delta)
  }

  renderer.render(scene, camera)

  // @ts-expect-error
  fpsGraph.end()
}

requestAnimationFrame(tick)
