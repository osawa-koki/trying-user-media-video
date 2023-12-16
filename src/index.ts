/* eslint-disable @typescript-eslint/no-non-null-assertion */

const button = document.getElementById('button')! as HTMLButtonElement
const video = document.getElementById('video')! as HTMLVideoElement

let isCameraOn = false

const chunks: Blob[] = []
let mediaRecorder: MediaRecorder | null = null

const cameraInit = (): void => {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 400,
      height: 300,
      facingMode: 'environment'
    }
  })
    .then((mediaStream) => {
      video.srcObject = mediaStream

      mediaRecorder = new MediaRecorder(mediaStream)

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      })

      mediaRecorder.start(100)

      mediaRecorder.addEventListener('stop', () => {
        console.log('stop')
      })
    })
    .catch((err) => {
      console.error(err.toString())
    })
}

button.addEventListener('click', () => {
  if (isCameraOn) {
    video.pause()
    video.srcObject = null
    isCameraOn = false

    mediaRecorder?.stop()

    const blob = new Blob(chunks, { type: 'video/webm' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'video.webm'
    a.click()
  } else {
    cameraInit()
    isCameraOn = true
  }
})

/* eslint-enable @typescript-eslint/no-non-null-assertion */
