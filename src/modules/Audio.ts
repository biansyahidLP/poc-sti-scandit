import successAudio from 'assets/audio/success_notification.wav'
import errorAudio from 'assets/audio/error_notification.wav'
export const notification = (type = 'success') => {
  let audio = null
  switch (type) {
    case 'success':
      audio = new Audio(successAudio)
      break
    case 'error':
      audio = new Audio(errorAudio)
      break
    default:
      break
  }

  if (!audio) return
  audio.volume = 1
  audio.play()
  audio.remove()
}
