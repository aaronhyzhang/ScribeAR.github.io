import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import { flip_recording } from '../../../../redux/actions'

export default function Record(props) {
     const recording = (state) => state.recording
     const setting = useSelector(recording)
     const dispatch = useDispatch()
     return (
          <div className="row">
               <div className="col-8">
                    <p>{setting ? "Recording" : "Record"}</p>
               </div>
               <div className="col-2 align-items-center" id="icon">
                    <input className={setting ? "hidden" : "shown"}
                         type="image" id="record" height="60vh"
                         alt="Record"
                         src={"./public/record_btn.jpg"}
                         onClick={() => dispatch(flip_recording())} />
                    <input className={setting ? "shown" : "hidden"}
                         type="image" id="stop" height="60vh"
                         alt="Stop"
                         src={"./public/stop_btn.jpg"}
                         onClick={() => dispatch(flip_recording())} />
               </div>
          </div>
     )
}