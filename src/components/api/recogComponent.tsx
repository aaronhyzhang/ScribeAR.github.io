import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import { RootState } from '../../store';
import { 
   DisplayStatus, AzureStatus, STATUS, API,
   ControlStatus, ApiStatus, WhisperStatus 
} from '../../react-redux&middleware/redux/typesImports';
import { STTRenderer } from '../sttRenderer';


export const RecogComponent: React.FC = (props) => {
   const dispatch = useDispatch()
   const control = useSelector((state: RootState) => {
      return state.ControlReducer as ControlStatus;
   });
   const textSize = useSelector((state: RootState) => {
      return state.DisplayReducer as DisplayStatus;
   });
   const azureStatus = useSelector((state: RootState) => {
      return state.AzureReducer as AzureStatus
   })
   const apiStatus = useSelector((state: RootState) => {
      return state.APIStatusReducer as ApiStatus
   })
   const whisperStatus = useSelector((state: RootState) => {
      return state.WhisperReducer as WhisperStatus
   })
   useEffect(() => {
      if (apiStatus.currentApi == API.AZURE_TRANSLATION) {
         Swal.fire({
            title: `It appears you were using Azure recognizer last time, would you like to switch to that?`,
            icon: 'info',
            allowOutsideClick: false,
            showDenyButton: true,
            confirmButtonText: 'Yes!',
            }).then((result) => {
               if (result.isConfirmed) {
                  Swal.fire('Switching to Azure', '', 'success')
                  let copyStatus = Object.assign({}, apiStatus);
                  copyStatus.currentApi = API.AZURE_TRANSLATION;
                  copyStatus.webspeechStatus = STATUS.AVAILABLE;
                  copyStatus.whisperStatus = STATUS.AVAILABLE;
                  copyStatus.azureConvoStatus = STATUS.AVAILABLE;
                  copyStatus.azureTranslStatus = STATUS.TRANSCRIBING;
                  dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
               } else {
                  let copyStatus = Object.assign({}, apiStatus);
                  copyStatus.currentApi = API.WEBSPEECH;
                  copyStatus.webspeechStatus = STATUS.TRANSCRIBING;
                  copyStatus.whisperStatus = STATUS.AVAILABLE;
                  copyStatus.azureConvoStatus = STATUS.AVAILABLE;
                  copyStatus.azureTranslStatus = STATUS.AVAILABLE;
                  dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
               }
            })
      }
   },[])

   // const textSizeA = "" + textSize.textSize + "vh"
   // const { azureTranscripts, azureListen } = useAzureTranslRecog();
   // const { transcripts, listen } = useWebSpeechRecog();

   // const stateRefControl = React.useRef(control)
   // const stateRefAzure = React.useRef(azureStatus)
   // const stateCurrentAPI = React.useRef(apiStatus)
   // stateRefControl.current = control
   // stateRefAzure.current = azureStatus
   // stateCurrentAPI.current = apiStatus
   // const webspeechHandler = async () => {
   //    const recognizedMessage = await listen(transcriptsFull, stateRefControl, stateCurrentAPI).then(response => {  
   //       if (stateRefControl.current.listening && stateCurrentAPI.current.currentApi == 0) {
   //          transcriptsFull = transcriptsFull + response
   //          webspeechHandler()
   //       }
   //       }
   //    );
   // };
   // const azureHandler = async () => {
   //    const recognizedMessage = await azureListen(transcriptsFull, stateRefControl, stateRefAzure, stateCurrentAPI).then(response => {  
   //       if (stateRefControl.current.listening && stateCurrentAPI.current.currentApi == 1) {
   //          transcriptsFull = transcriptsFull + response
   //          azureHandler()
   //       }
   //       }
   //    );
   // };

   const sttElem : JSX.Element = STTRenderer();
   // const capts = document.getElementById('captionsSpace')
   // if (capts != null) {
   //    let isScrolledToBottom = capts.scrollHeight - capts.clientHeight <= capts.scrollTop + 1
   //    capts.scrollTop = capts.scrollHeight - capts.clientHeight // scroll to bottom
   // }

   
   return sttElem;
};
