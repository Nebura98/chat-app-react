import React, { useContext } from 'react'
import { ChatContext } from '../context/chat/ChatContext'
import { fetchConToken } from '../helpers/fetch'
import { scrollToBottom } from '../helpers/scrollToBottom'
import { types } from '../types/types'

export const SidebarChatItem = ({ usuario }) => {

  const { chatState, dispatch } = useContext(ChatContext)

  const onClick = async () => {
    dispatch({
      type: types.activarChat,
      payload: usuario.uid
    })

    const resp = await fetchConToken(`mensajes/${usuario.uid}`)
    console.log(resp);

    dispatch({
      type: types.cargarMensajes,
      payload: resp.mensajes
    })

    scrollToBottom('mensajes')
  }

  return (
    <div
      className={`chat_list ${usuario.uid === chatState.chatActivo && 'active_chat'} `}
      onClick={onClick}
    >
      <div className="chat_people">
        <div className="chat_img">
          <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
        </div>
        <div className="chat_ib">
          <h5>{usuario.nombre}</h5>
          {
            (usuario.online)
              ? <span className="text-success">Online</span>
              : <span className="text-danger">Offline</span>
          }
        </div>
      </div>
    </div>
  )
}
