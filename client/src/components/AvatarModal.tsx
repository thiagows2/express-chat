import Modal from 'react-modal'
import AvatarEditor from 'react-avatar-editor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MdClose } from 'react-icons/md'

Modal.setAppElement('#root')

const avatars = [
  '1-homem-negro.png',
  '2-homem-branco.png',
  '3-mulher-negra.png',
  '4-homem-oculos.png',
  '5-mulher-branca.png',
  '6-homem-negro-jovem.png',
  '7-homem-moreno.png',
  '8-homem-rastafari.png',
  '9-mulher-azul.png',
  '10-mulher-jovem.png'
]

type AvatarModalType = {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatar: string, isUploaded: boolean) => void
}

export default function AvatarModal({
  isOpen,
  onClose,
  onSelect
}: AvatarModalType) {
  const editorRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState('')

  const handleOutsideClick = useCallback(
    function (event: MouseEvent) {
      // @ts-ignore
      const isClickOutside = !event.target?.id?.includes('avatar')

      if (isClickOutside && !isUploading) {
        setSelectedAvatar('')
      }
    },
    [isUploading]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', handleOutsideClick)
    } else {
      window.removeEventListener('click', handleOutsideClick)
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [handleOutsideClick, isOpen])

  function handleAvatarClick(avatar: string) {
    setSelectedAvatar(avatar)
  }

  function handleUploadAvatar(event: any) {
    setIsUploading(true)
    const file = event.target.files[0]
    if (file) {
      setSelectedAvatar(URL.createObjectURL(file))
    }
  }

  function handleContinue() {
    const currentAvatar = isUploading
      ? // @ts-ignore
        editorRef.current.getImageScaledToCanvas().toDataURL()
      : selectedAvatar
    if (!currentAvatar) return

    console.log(currentAvatar)
    onSelect(currentAvatar, isUploading)
    onClose()
    setSelectedAvatar('')
    setIsUploading(false)
  }

  function handleClose() {
    setSelectedAvatar('')
    setIsUploading(false)
    onClose()
  }

  function handleScaleChange(event: any) {
    const scale = parseFloat(event.target.value)
    setScale(scale)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Selecionar Avatar"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="p-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-md w-[480px] text-center">
        <MdClose
          className="absolute text-black text-[26px] right-4 top-4 cursor-pointer"
          onClick={handleClose}
        />
        <h1 className="text-xl font-bold text-black">Avatar</h1>
        {isUploading ? (
          <div className="flex flex-col items-center gap-4 my-5">
            <AvatarEditor
              ref={editorRef}
              image={selectedAvatar}
              width={150}
              height={150}
              border={50}
              borderRadius={100}
              scale={scale}
            />
            <input
              type="range"
              className="w-36 appearance-none h-3 bg-gray-300 rounded-md text-black"
              min="1"
              max="2"
              step="0.01"
              onChange={handleScaleChange}
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 my-10">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded cursor-pointer ${
                  selectedAvatar === avatar && 'border-2 border-[#3D3E51]'
                }`}
                onClick={() => handleAvatarClick(avatar)}
              >
                <img
                  id={`avatar-${index}`}
                  src={`avatars/${avatar}`}
                  alt={`Avatar ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        <div
          className={`flex justify-end mt gap-4 ${
            isUploading && 'justify-center'
          }`}
        >
          {!isUploading && (
            <>
              <label
                htmlFor="upload-avatar"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 w-36 cursor-pointer"
              >
                Fazer upload
              </label>
              <input
                type="file"
                id="upload-avatar"
                accept="image/*"
                className="hidden"
                onChange={handleUploadAvatar}
              />
            </>
          )}
          <button
            className={`bg-black px-3 py-2 rounded-md hover:bg-gray-600 transition-all w-36 ${
              !selectedAvatar && 'opacity-80 cursor-not-allowed'
            }`}
            onClick={handleContinue}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  )
}
