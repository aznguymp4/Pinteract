import { useState, useEffect } from "react"
import { makeErr } from "./util"

  // you can hide the cancel button by making cancelTxt = -1
export const ConfirmModal = ({title, sub1, sub2, cancelTxt, confirmTxt, onConfirm, onCancel}) => <>
  <div id="modalTitle">{title}</div>
  <div className="modalTxt ac">{sub1}</div>
  {sub2 && <div className="c400 s200 ac">{sub2}</div>}
  <div id="modalBtns">
    {cancelTxt!==-1 && <div className="btn" onClick={onCancel}>{cancelTxt || 'Cancel'}</div>}
    <div className='btn bRed' onClick={onConfirm}>{confirmTxt||'Confirm'}</div>
  </div>
</>
export const TextInputModal = ({title, minWidth, charLimit, presetValue, placeholder, label, cancelTxt, submitTxt, onSubmit, onCancel}) => {
  const [val, setVal] = useState(presetValue)
  const [canSubmit, setCanSubmit] = useState(false)
  useEffect(()=>{
    if(!charLimit) return setCanSubmit(true)
    setCanSubmit(val && val.length <= charLimit)
  }, [val, charLimit])

  return <>
    <div id="modalTitle" style={minWidth?{minWidth}:null}>{title}</div>
    <div className={`formInputText ${val.length>charLimit && 'error'}`}>
      <label>{label} {val.length>charLimit && makeErr(1,`Must be ${charLimit} characters or less`)}</label>
      <input
        type="text"
        value={val}
        placeholder={placeholder}
        onChange={e => setVal(e.target.value)}
      />
    </div>
    <div id="modalBtns">
      {cancelTxt!==-1 && <div className="btn" onClick={e=>onCancel(e,val)}>{cancelTxt || 'Cancel'}</div>}
      <div className={`btn bRed${canSubmit?'':' disabled'}`} onClick={e=>{
        if(canSubmit) onSubmit(e,val)
      }}>{submitTxt||'Submit'}</div>
    </div>
  </>
}