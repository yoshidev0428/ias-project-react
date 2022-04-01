import React, { useState } from 'react'



const Message = (props) => {
    const [content, setContent] = useState('')
    const [type, setType] = useState('')
    const [timer, setTimer] = useState(3000)
    const [isShow, setIsShow] = useState(false)

    const show = () => {
        setIsShow(true)
        setTimeout(hide, timer)
    }

    const hide = () => {
        setIsShow(false)
    }

    return (
        <transition name="fade" v-if="isShow">
            <div className='tip-box'>
                <div className="tip-box-content">
                    { props.content }
                </div>
            </div>
        </transition>
    )
}


export default Message