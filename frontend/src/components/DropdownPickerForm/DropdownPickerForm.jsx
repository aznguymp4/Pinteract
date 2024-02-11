import "./DropdownPickerForm.css";

const DropdownPickerForm = ({ title, body }) => {
	return <>
		<div id="modalTitle">{title}</div>
		<div id="pickerFormBody">{body}</div>
	</>
}

export default DropdownPickerForm;
