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

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/1.png')

const geometry = new THREE.BufferGeometry()

const count = 15000
const positionsArray = new Float32Array(count * 3)
const colorsArray = new Float32Array(count * 3)

for (let i =0; i < count * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 20
  colorsArray[i] = Math.random()
}

const positions = new THREE.BufferAttribute(positionsArray, 3)
const colors = new THREE.BufferAttribute(colorsArray, 3)
geometry.setAttribute('position', positions)
geometry.setAttribute('color', colors)


const material = new THREE.PointsMaterial({
  size:0.2,
  transparent: true,
  alphaMap:particleTexture,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending:THREE.AdditiveBlending
})

material.vertexColors = true

const mesh = new THREE.Points(geometry, material)

scene.add(mesh)

const cubeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial()
)

scene.add(cubeMesh)

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

const fpsGraph = pane.addBlade({
  view: 'fpsgraph',

  label: 'fpsgraph',
  rows: 2,
})


const tick = () => {
  // @ts-expect-error
  fpsGraph.begin()


  // 渲染
  orbitControls.update()

  renderer.render(scene, camera)

  // @ts-expect-error
  fpsGraph.end()
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)
