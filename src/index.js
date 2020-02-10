import { WebGLRenderer, PerspectiveCamera, Scene, AmbientLight, MeshLambertMaterial, PointLight } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTFLoader()
const renderer = new WebGLRenderer()
const scene = new Scene()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const camera = new PerspectiveCamera(2, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const ambientLight = new AmbientLight('blue', 0.5)
scene.add(ambientLight)

const pointLight = new PointLight('yellow', 0.5)
scene.add(pointLight)

let text
loader.load('text.glb', (gltf) => {
  console.log(gltf.scene)
  text = gltf.scene.children[0]
  text.material = new MeshLambertMaterial()
  text.position.z = -10
  text.scale.set(2, 2, 2)
  scene.add(text)
  render()
}, undefined, (error) => {
	console.error(error)
})

function render() {
  requestAnimationFrame(render)

  text.rotation.x += 0.05
  camera.position.z += 0.01

  renderer.render(scene, camera)
}