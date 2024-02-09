import { useState } from "react";
import { useModal } from "../../context/Modal";
import "./DropdownPickerForm.css";

const DropdownPickerForm = ({ title, body }) => {
	const { closeModal } = useModal()
	const [canSubmit, setCanSubmit] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	const submit = () => {
		if(!canSubmit) return
		setSubmitting(true)
	}

	return <>
		<div id="modalTitle">{title}</div>
		<div id="pickerFormBody">{body}</div>
	</>
}

export default DropdownPickerForm;
