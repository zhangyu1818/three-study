import * as THREE from 'three'

import { animate } from 'from-to.js'

import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// 创建场景
const scene = new THREE.Scene()

// 创建Box几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// 用几何体和材质创建网格
const mesh = new THREE.Mesh(geometry, material)
mesh.position.z = -3

// 将网格添加到场景
scene.add(mesh)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// 创建相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

// 将相机添加到场景
scene.add(camera)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
})
// 设置渲染器大小
renderer.setSize(sizes.width, sizes.height)

// 渲染
renderer.render(scene, camera)

animate(0, 1, {
  type: 'spring',
  loop: true,
  loopDelay: 1,
  mass: 3,
  onUpdate(v) {
    mesh.rotation.y = v * Math.PI * 2
    mesh.position.x = Math.cos(v * 3)

    renderer.render(scene, camera)
  },
})
