import { useDispatch } from "react-redux";
import { SRecognition, API, STATUS } from "../typesImports";


const defaultSRecognition = () : SRecognition => {
   return {
      recognizer: null,
      // handler: null,
      // resetTranscript: () => useDispatch()('RESET_TRANSCRIPT'),
      status: STATUS.NULL,
      api: API.WEBSPEECH,
   }
}

export const SRecognitionReducer = (state = defaultSRecognition(), action : {type: string; payload}) => {
   // let copyStatus : SRecognition = {...state}; // Object.assign({}, state);

   switch (action.type) {
      case 'SET_RECOG': // Change the entire recogStatus
         return action.payload;
      case 'sRecog/set_status':
         return {...state, status: action.payload.status};
      // case 'SET_RECOG_STATUS':
      //    return {...state, status: action.payload.status};
      case 'SET_RECOG_API':
         return {...state, api: action.payload.api};
      // case 'SET_HANDLER':
      //    return {...state, handler: action.payload.handler};
      // case 'SET_RESET_TRANSCRIPT':
      //    return {...state, resetTranscript: action.payload.resetTranscript};
      default:
         return state;
   }
}