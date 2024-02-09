import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate, useParams, Link } from "react-router-dom";
import { thunkCreatePin, thunkFetch1Pin, thunkEditPin } from "../../redux/pin";
import "./PinCreateForm.css";
import FileUpload from '../FileUpload'
import ToggleSwitch from "./ToggleSwitch";
import SignupFormModal from '../SignupFormModal'
import LoginFormModal from '../LoginFormModal'

export const makeErr = (bool, msg) => {
  return bool && <span className="labelErr"><i className="fas fa-exclamation-triangle"/> {msg}</span>
}

const PinCreateForm = ({ edit }) => {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const { setModalContent } = useModal()

  const { pinId } = useParams()
  const sessionUser = useSelector(s=>s.session.user)
  const pin = useSelector(s=>edit? s.pin[pinId] : null)
  
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [descLength, setDescL] = useState(0)
  const [isPublic, setPublic] = useState(true)
  const [commentable, setCommentable] = useState(true)
	const [src, setSrc] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [canPublish, setCanPublish] = useState(false)
  
  useEffect(()=>{
		if(edit && pin && sessionUser?.id != pin?.authorId) return nav('/unauthorized')
	},[edit, sessionUser, pin, nav])

  useEffect(()=>{
    setCanPublish(title.length<=100 && descLength<=800 && src && !publishing)
  }, [title, descLength, src, publishing])
  useEffect(()=>dispatch(thunkFetch1Pin(pinId)), [dispatch, pinId])
  useEffect(()=>{
    if(!edit || !pin) return
    setTitle(pin.title || '')
    setDesc(pin.desc || '')
    setDescL(pin.desc?.length || '')
    setPublic(pin.public)
    setCommentable(pin.canComment)
    setSrc(pin.img)
  }, [edit,pin])

  const handleSubmit = e => {
    e.preventDefault()
    if(!canPublish) return
    setPublishing(true)
    const body = {img: src, title, desc, public: isPublic, canComment: commentable}

    if(edit) dispatch(thunkEditPin(pinId, body, nav))
    else dispatch(thunkCreatePin(body, nav))
  }

	return <>
    <form onSubmit={handleSubmit}>
      {!sessionUser && <div id="pinAuthReq">
        <div>
          <span>Must be logged in to upload a Pin!</span>
          <div id="pinAuthReqBtns">
            <div className="btn" onClick={() => setModalContent(<SignupFormModal/>)}>Sign Up</div>
            <div className="btn bRed" onClick={() => setModalContent(<LoginFormModal/>)}>Log In</div>
          </div>
        </div>
      </div>}
      <div id="pinFormTopBar">
        <div id="pinFormTopBarTitle" className="s400 wsemibold" style={{marginLeft:`${edit?0:26}px`}}>
          {pinId && <Link id="backBtnForm" to={-1}>
            <i className="fas fa-angle-left fa-lg"/>
          </Link>}
          {edit? 'Edit':'Create'} Pin
        </div>
        {publishing && <div id="pinFormTopBarSpin"><i className="fas fa-cog fa-spin c400"/></div>}
        <input type="submit" disabled={!canPublish} style={{marginRight:'16px'}} className="s300 wsemibold btn bRed" value={edit?'Save':'Publish'}/>
      </div>
      <div id="pinFormBody">
        <div id="pinFormBodyL">
          <FileUpload
            types={'image/*'}
            id={'pinFormBodyLImg'}
            src={src}
            setSrc={setSrc}
          />
        </div>
        <div id="pinFormBodyR">
          <div className={`formInputText ${title.length>100 && 'error'}`}>
            <label>Title {makeErr(title.length>100, 'Title must be 100 characters or less')}</label>
            <input
              type="text"
              placeholder="Add a title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className={`formInputText ${descLength>800 && 'error'}`}>
            <label>Description {makeErr(descLength>800, 'Description must be 800 characters or less')}</label>
            {!descLength && <div className="spanPlaceholder">Add a detailed description</div>}
            <span
              contentEditable
              className="spanTextInput"
              onBlur={e => setDesc(e.target.innerText)}
              onInput={e => setDescL(e.target.innerText.length)}
            >{desc}</span>
          </div>
          <ToggleSwitch
            label="Public"
            setState={setPublic}
            state={isPublic}
          />
          <ToggleSwitch
            label="Allow Comments"
            setState={setCommentable}
            state={commentable}
          />
        </div>
      </div>
    </form>
	</>
}

export default PinCreateForm;
