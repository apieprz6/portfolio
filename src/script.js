import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
let donuts = []
let loaded = false
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new THREE.TextBufferGeometry(
            'Alex Pieprzycki.js',
            {
                font: font,
                size: .5,
                height: .2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        // Use bounding to recenter the text. By default three.js uses sphere bounding.
        // We want to use box bounding
        // textGeometry.computeBoundingBox()
        // // We want to move geometry NOT the mesh to center the text
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - .02) / 2, // bevel size
        //     - (textGeometry.boundingBox.max.y - .02) / 2, // bevel size
        //     - (textGeometry.boundingBox.max.z - .03) / 2, // bevel thickness
        // )
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial()
        material.matcap = matcapTexture
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        console.time('donuts')
        const donutGeometry = new THREE.TorusBufferGeometry(.3, .2, 20, 45);
        
        // const donutMaterial = new THREE.MeshMatcapMaterial()

        for (let i = 0; i < 300; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)

            donut.position.x = (Math.random() - .5) * 10
            donut.position.y = (Math.random() - .5) * 10
            donut.position.z = (Math.random() - .5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const randomScale = Math.random()
            donut.scale.x = randomScale
            donut.scale.y = randomScale
            donut.scale.z = randomScale

            donuts.push({
                mesh: donut,
                rotationX: donut.rotation.z,
                rotationY: donut.rotation.y,
                rotationSpeed: Math.random()
            })
            scene.add(donut)
        }

        console.timeEnd('donuts')
        loaded = true
    }
)

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    if (loaded) {
        for (let i = 0; i < donuts.length; i++) {
            // console.log(donuts[i]);
            donuts[i].mesh.rotation.z = Math.sin((donuts[i].rotationX + elapsedTime) * donuts[i].rotationSpeed)
            donuts[i].mesh.rotation.y = Math.sin((donuts[i].rotationY + elapsedTime) * donuts[i].rotationSpeed)
        }   
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()