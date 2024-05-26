import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

import debounce from 'lodash.debounce'

import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'

import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

const pane = new Pane()
pane.registerPlugin(EssentialsPlugin)

// 创建场景
const scene = new THREE.Scene()

let points: THREE.Points
let geometry: THREE.BufferGeometry
let material: THREE.PointsMaterial

const params = {
  count: 10000,
  size: 0.01,
  radius: 5,
  randomness: 0.2,
  randomnessPower: 3,
  spin: 1,
  branches: 3,
  insideColor: 0xff6030,
  outsideColor: 0x1b3984,
  speed: 0.02,
}

const generatePoints = () => {
  geometry?.dispose()
  material?.dispose()
  if (points) {
    scene.remove(points)
  }

  const {
    count,
    size,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor,
  } = params

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const randomRadius = Math.random() * radius
    const spinAngle = randomRadius * spin
    const branchAngle = ((i % branches) / branches) * Math.PI * 2

    const randomX =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      randomRadius
    const randomY =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      randomRadius
    const randomZ =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      randomRadius

    positions[i3] = Math.cos(branchAngle + spinAngle) * randomRadius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] =
      Math.sin(branchAngle + spinAngle) * randomRadius + randomZ

    const colorInside = new THREE.Color(insideColor)
    const colorOutside = new THREE.Color(outsideColor)

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, randomRadius / radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  material = new THREE.PointsMaterial({
    size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  points = new THREE.Points(geometry, material)
  points.rotation.x = Math.PI / 6

  scene.add(points)
}

generatePoints()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// 创建相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 8
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

const debounceGeneratePoints = debounce(generatePoints, 100)

pane
  .addBinding(params, 'count', {
    min: 10000,
    max: 10000000,
    step: 10000,
  })
  .on('change', debounceGeneratePoints)

pane
  .addBinding(params, 'size', {
    min: 0.001,
    max: 0.01,
    step: 0.0001,
  })
  .on('change', debounceGeneratePoints)

pane
  .addBinding(params, 'radius', {
    min: 0.1,
    max: 10,
    step: 0.1,
  })
  .on('change', debounceGeneratePoints)

pane
  .addBinding(params, 'randomness', {
    min: 0,
    max: 2,
    step: 0.01,
  })
  .on('change', debounceGeneratePoints)

pane
  .addBinding(params, 'randomnessPower', {
    min: 1,
    max: 10,
    step: 1,
  })
  .on('change', debounceGeneratePoints)

pane
  .addBinding(params, 'spin', {
    min: -5,
    max: 5,
    step: 0.01,
  })
  .on('change', debounceGeneratePoints)

pane
  .addBinding(params, 'branches', {
    min: 1,
    max: 20,
    step: 1,
  })
  .on('change', debounceGeneratePoints)

pane
  .addBinding(params, 'insideColor', {
    view: 'color',
  })
  .on('change', debounceGeneratePoints)

pane
  .addBinding(params, 'outsideColor', {
    view: 'color',
  })
  .on('change', debounceGeneratePoints)

pane.addBinding(params, 'speed', {
  min: 0.01,
  max: 1,
  step: 0.01,
})

const fpsGraph = pane.addBlade({
  view: 'fpsgraph',

  label: 'fpsgraph',
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

  const elapsedTime = timer.getElapsed()

  if (points) {
    points.rotation.y = -elapsedTime * params.speed
  }

  renderer.render(scene, camera)

  // @ts-expect-error
  fpsGraph.end()
}

requestAnimationFrame(tick)
