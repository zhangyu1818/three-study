import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'

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

const sphereMesh1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial(),
)
sphereMesh1.position.x = -2
scene.add(sphereMesh1)

const sphereMesh2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial(),
)
scene.add(sphereMesh2)

const sphereMesh3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial(),
)
sphereMesh3.position.x = 2
scene.add(sphereMesh3)

// 创建相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = -5
// 将相机添加到场景
scene.add(camera)

const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true

// 灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
})

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width - 0.5) * 2
  mouse.y = -(event.clientY / sizes.height - 0.5) * 2

  raycaster.setFromCamera(mouse, camera)
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

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()
let currentIntersect: THREE.Intersection | null = null

const tick = (timestamp: number) => {
  // @ts-expect-error
  fpsGraph.begin()

  // 渲染
  orbitControls.update()

  const elapsed = timer.getElapsed()

  sphereMesh1.position.y = Math.sin(elapsed * 0.3) * 1.5
  sphereMesh2.position.y = Math.sin(elapsed * 0.8) * 1.5
  sphereMesh3.position.y = Math.sin(elapsed * 1.4) * 1.5

  const intersects = raycaster.intersectObjects([
    sphereMesh1,
    sphereMesh2,
    sphereMesh3,
  ])

  if (intersects.length > 0) {
    if (currentIntersect === null) {
      intersects[0].object.scale.set(1.2, 1.2, 1.2)
    }

    currentIntersect = intersects[0]
  } else {
    if (currentIntersect) {
      currentIntersect.object.scale.set(1, 1, 1)
    }

    currentIntersect = null
  }

  requestAnimationFrame(tick)
  timer.update(timestamp)

  renderer.render(scene, camera)

  // @ts-expect-error
  fpsGraph.end()
}

requestAnimationFrame(tick)
