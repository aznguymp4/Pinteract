const modalTemplates = {
  // you can hide the cancel button by making cancelTxt = -1
  ConfirmModal: ({title, sub1, sub2, cancelTxt, confirmTxt, onConfirm, onCancel}) => <>
    <div id="modalTitle">{title}</div>
    <div className="modalTxt ac">{sub1}</div>
    {sub2 && <div className="c400 s200 ac">{sub2}</div>}
    <div id="modalBtns">
      {cancelTxt!==-1 && <div className="btn" onClick={onCancel}>{cancelTxt || 'Cancel'}</div>}
      <div className='btn bRed' onClick={onConfirm}>{confirmTxt||'Confirm'}</div>
    </div>
  </>
}
export default modalTemplates