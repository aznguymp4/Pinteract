import { useState } from 'react'
import { uploadFile } from '../../redux/files'
import './FileUpload.css'

const FileUpload = ({ types, id, src, setSrc }) => {
	const [progress, setProgress] = useState(0)
	const [showBar, setShowBar] = useState(false)
	const [progressMsg, setProgressMsg] = useState('')

	const triggerFileInput = () => document.getElementById(`fileUpload-${id}`)?.click()
	const fileSelect = e => {
		const file = e.target.files[0]
		setShowBar(Boolean(file))
		if(!file) return setSrc('')
		console.log(file.size)
		if(file.size > 8192000) {
			setProgressMsg('File size must be <8MB')
			setProgress(-1)
			return setSrc('')
		}

		uploadFile(file, setProgress).then(url => {
			setProgress(1)
			setSrc(url)
		}).catch(e => {
			setProgress(-1)
			console.error(e)
		})
	}

	return <div>
		<input
			type="file"
			id={`fileUpload-${id}`}
			style={{ display: 'none' }}
			onChange={fileSelect}
			accept={types}
		/>
		<div
			className={`fileUploadBox${src?'':' empty'}`}
			style={src?{backgroundImage:`url(${src})`}:undefined}
			onClick={triggerFileInput}
		>
			<div className='fileUploadLabel'>
				<svg height="32" width="32" viewBox="0 0 24 24" aria-label="Add file" role="img"><path d="M24 12a12 12 0 1 0-24 0 12 12 0 0 0 24 0m-10.77 3.75a1.25 1.25 0 0 1-2.5 0V11.8L9.7 12.83a1.25 1.25 0 0 1-1.77-1.77L12 7l4.07 4.06a1.25 1.25 0 0 1-1.77 1.77l-1.07-1.06z"></path></svg>
				<div className="w500">Choose a file to upload</div>
			</div>
		</div>
		{showBar && <div className='fileUploadBar w800 si s100'>
			<div className={`fileUploadBarFill${progress===1?' done':progress===-1?' error':''}`} style={{transform:`translateX(${(progress*100)-100}%)`}}/>
			<div className='fileUploadBarText'>{progress===1?'UPLOAD COMPLETE!' :progress===-1? 'UPLOAD FAILED...\n'+progressMsg : `UPLOADING... ${Math.round(progress*100)}%`}</div>
		</div>}
	</div>
}

export default FileUpload