import React, { useContext, useState } from 'react'
import { Header, CloseButton, Input } from '../Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'

const EditPlaygroundTitle = () => {
  const { isOpenModal, closeModal } = useContext(ModalContext);
  const { editPlaygroundTitle, folders } = useContext(PlaygroundContext);

  const { folderId, cardId } = isOpenModal.identifiers;
  const folder = folders.filter(folder => folder._id === folderId);
  const playground = folder[0].playgrounds.filter(playground => playground._id === cardId);
  const [playgroundTitle, setPlaygroundTitle] = useState(playground.title);

  return (
    <>
      <Header>
        <h2>Edit Card Title</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <Input>
        <input type="text" onChange={(e) => setPlaygroundTitle(e.target.value)} />
        <button onClick={() => {
          editPlaygroundTitle(folderId, cardId, playgroundTitle)
          closeModal()
        }}>Update Title</button>
      </Input>
    </>
  )
}

export default EditPlaygroundTitle