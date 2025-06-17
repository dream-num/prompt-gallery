interface ClipboardService {
  copy(text: string): Promise<boolean>
}

class ClipboardServiceImpl implements ClipboardService {
  private messageCallback?: (message: string) => void

  setMessageCallback(callback: (message: string) => void) {
    this.messageCallback = callback
  }

  async copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        this.showMessage('Copied successfully!')
        return true
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (successful) {
          this.showMessage('Copied successfully!')
          return true
        } else {
          this.showMessage('Copy failed, please copy manually')
          return false
        }
      }
    } catch (err) {
      console.error('Failed to copy text: ', err)
      this.showMessage('Copy failed, please copy manually')
      return false
    }
  }

  private showMessage(message: string) {
    if (this.messageCallback) {
      this.messageCallback(message)
    }
  }
}

export const clipboardService = new ClipboardServiceImpl()
export type { ClipboardService }