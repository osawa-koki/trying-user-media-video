/* eslint-disable @typescript-eslint/no-non-null-assertion */

const button = document.getElementById('button')! as HTMLButtonElement
const video = document.getElementById('video')! as HTMLVideoElement

const chunks: Blob[] = []
let mediaRecorder: MediaRecorder | null = null

const startCamera = (): void => {
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
        mediaRecorder = null
      })
    })
    .catch((err) => {
      console.error(err.toString())
    })
}

const endCamera = (): void => {
  video.pause()
  video.srcObject = null
  mediaRecorder?.stop()
}

button.addEventListener('click', () => {
  if (mediaRecorder != null) {
    button.value = 'Start'
    endCamera()

    const blob = new Blob(chunks, { type: 'video/webm' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'video.webm'
    a.click()
    chunks.length = 0
  } else {
    button.value = 'Stop'
    startCamera()
  }
})

/* eslint-enable @typescript-eslint/no-non-null-assertion */
