import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
   DisplayStatus, AzureStatus, ControlStatus, 
   ApiStatus, SRecognition, Transcript,
   ScribeRecognizer, ScribeHandler, } from '../../react-redux&middleware/redux/typesImports';
import { API, ApiType, STATUS, StatusType } from '../../react-redux&middleware/redux/typesImports';
import { RootState } from '../../store';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

import  { getWebSpeechRecog, useWebSpeechRecog } from './web-speech/webSpeechRecog';
import { getAzureTranslRecog, testAzureTranslRecog, useAzureTranslRecog } from './azure/azureTranslRecog';
import { loadTokenizer } from '../../ml/bert_tokenizer';

import { intent_inference } from '../../ml/inference';


// controls what api to send and what to do when error handling.

// NOTES: this needs to do everything I think. Handler should be returned which allows
//        event call like stop and the event should be returned... (maybe the recognition? idk.)

/*
* === * === *   DO NOT DELETE IN ANY CIRCUMSTANCE   * === * === *
* === * TRIBUTE TO THE ORIGINAL AUTHOR OF THIS CODE: Will * === *
DO NOT DELETE IN ANY CIRCUMSTANCE
export const returnRecogAPI = (api : ApiStatus, control : ControlStatus, azure : AzureStatus) => {
   // const apiStatus = useSelector((state: RootState) => {
   //    return state.APIStatusReducer as ApiStatus;
   // })
   // const control = useSelector((state: RootState) => {
   //    return state.ControlReducer as ControlStatus;
   // });
   // const azureStatus = useSelector((state: RootState) => {
   //    return state.AzureReducer as AzureStatus;
   // })
   const recognition : Promise<any> = getRecognition(api.currentApi, control, azure);
   const useRecognition : Object = makeRecognition(api.currentApi);
   // const recogHandler : Function = handler(api.currentApi);


   return ({ useRecognition, recognition });
}
* === * === *   DO NOT DELETE IN ANY CIRCUMSTANCE   * === * === *
* === * TRIBUTE TO THE ORIGINAL AUTHOR OF THIS CODE: Will * === *
*/

/**
 * 
 * @param recognition 
 * @returns 
 */
const makeWebSpeechHandler = (recognition : ScribeRecognizer) : ScribeHandler => {
   const handler : ScribeHandler = (action) => {
      try {
         // console.log(103, recognition, action);
         recognition = recognition as SpeechRecognition;
         switch (action.type) {
            case 'STOP':
               recognition!.stop();
               break
            case 'START':
               recognition!.start();
               break
            case 'ABORT':
               recognition!.abort();
               break
            case 'CHANGE_LANGUAGE':
               recognition.lang = action.payload!;
               break
            default:
               return "poggers";
         }
      } catch (e : any) {
         console.log(`While trying to ${action.type} WebSpeech, an error occurred`, e);
      }
   }
   return handler;
}
/**
 * 
 * @param recognizer
 * @returns 
 */
const makeAzureTranslHandler = (recognizer : ScribeRecognizer) : ScribeHandler => {
   const handler : ScribeHandler = (action) => {
      try {
         recognizer = recognizer as sdk.TranslationRecognizer;
         switch (action.type) {
            case 'STOP':
               recognizer!.stopContinuousRecognitionAsync();
               break;
            case 'START':
               recognizer!.startContinuousRecognitionAsync()
               break;
            case 'ABORT':
               recognizer!.close()
               break;
            case 'CHANGE_LANGUAGE':
               recognizer!.addTargetLanguage(action.payload!)
               break;
            case 'CHANGE_PHRASE':
               // add phraseList
               let phraseList = sdk.PhraseListGrammar.fromRecognizer(recognizer);
               for (let i = 0; i < action.payload!.length; i++) {
                  phraseList.addPhrase(action.payload![i])
               }
               break;
            default:
               return "poggers";
         }
      } catch (e : any) {
         console.log(`While trying to ${action.type} Azure, an error occurred`, e);
      }
   }
   return handler;
}
// export const testRecognition = (control: ControlStatus, azure: AzureStatus, currentApi: number) => {
//     if (currentApi == 0) { // webspeech
//         // return getWebSpeechRecognition();
//         throw new Error("Not implemented");
//     } else if (currentApi == 1) { // azure translation
//         testAzureTranslRecog(control, azure).then((result) => {
//             console.log(result);
//         });

//         // getAzureTranslRecog(control, azure).then((recognizer : sdk.TranslationRecognizer) => {
//         //     testAzureTranslRecog(recognizer);
//         // }, (error_str : string) => {
//         //     reject(error_str);
//         // });
//     } else {
//         throw(`Unexpcted API: ${currentApi}`);
//     }
// }

const getRecognition = (currentApi: number, control: ControlStatus, azure: AzureStatus) => {
   // https://reactjs.org/docs/hooks-reference.html#usecallback
   // quote: "useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)."

   if (currentApi === API.WEBSPEECH) { // webspeech recognition
      return getWebSpeechRecog(control);
      // return useMemo(() => getWebSpeechRecog(control), []);
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure TranslationRecognizer
      return getAzureTranslRecog(control, azure);
      // return useMemo(() => getAzureTranslRecog(control, azure), []);
   } 
   else if (currentApi === API.AZURE_CONVERSATION) { // azure ConversationTranscriber
      throw new Error("Not implemented");
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
      // return useMemo(() => getWebSpeechRecog(control), []);
   }
}

// else if (currentApi === API.WHISPER){

// }

/**
 * Connect the recognizer to the event handler
 * @param currentApi 
 * @param recognizer 
 * @returns Promsie<ScribeHandler>
 */
const runRecognition = (currentApi: number, recognizer : ScribeRecognizer, dispatch : React.Dispatch<any>) => new Promise<ScribeHandler>((resolve, reject) => {
   if (currentApi === API.WEBSPEECH) { // webspeech recognition event controller
      useWebSpeechRecog(recognizer as SpeechRecognition, dispatch)
         .then(() => {
            resolve(makeWebSpeechHandler(recognizer));            
         })
         .catch((error_str : string) => {
            reject(error_str);
         });
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure recognition event controller
      useAzureTranslRecog(recognizer as sdk.TranslationRecognizer, dispatch)
         .then(() => {
            console.log(163, 'Azure recog initiated');
            resolve(makeAzureTranslHandler(recognizer));
         })
         .catch((error_str : string) => {
            console.log(167, error_str);
            reject(error_str);
         });
   } else {
      reject(`Unexpcted API_CODE: ${currentApi}`);
   }
});

/**
 * Called when the compoenent rerender.
 * Check current state, setup/start the recognizer if needed.
 * Always return the full transcripts, a function to reset the transcript,
 * and a function to change/handle recognizer (called in useEffect; when a api/listening change happens.).
 * 
 * Possible permutations of [ApiStatus, SRecognition, AzureStatus, ControlStatus]:
 * change can be monitored using useEffect or useCallback.
 * 1. first time call (recogStatus === null)
 *    - listening=false -> do nothing
 *    - listening=true -> start recognizer
 * 2. api change (called within a useEffect)
 *    - change recognizer and recogHandler, keep listening the same
 * 3. only listening change (called within a useEffect)
 *   - stop/pause recognizer
 * 
 * @param recog
 * @param api 
 * @param control 
 * @param azure 
 * 
 * @return transcripts, resetTranscript, recogHandler
 */
export const useRecognition = (sRecog : SRecognition, api : ApiStatus, control : ControlStatus, azure : AzureStatus) => {


   const [recogHandler, setRecogHandler] = useState<ScribeHandler>();
   // TODO: Add a reset button to utitlize resetTranscript
   // const [resetTranscript, setResetTranscript] = useState<() => string>(() => () => dispatch('RESET_TRANSCRIPT'));
   const [lastChangeApiTime, setLastChangeApiTime] = useState<number>(Date.now());
   const dispatch = useDispatch();


   // change recognizer, if api changed
   // TODO: currently we store the recognizer to redux, but never use it.
   useEffect(() => {
      if (api.currentApi !== API.WHISPER) {
         // stop recognizer
         if (recogHandler) recogHandler({type: 'STOP'});
         console.log(214,);

         getRecognition(api.currentApi, control, azure)
            .then((recog : ScribeRecognizer) => {
               runRecognition(api.currentApi, recog, dispatch)
                  .then((handler : ScribeHandler) => {
                     setRecogHandler(() => handler);

                     let copy_sRecog = Object.assign({}, sRecog);
                     copy_sRecog.recognizer = recog;
                     copy_sRecog.status = STATUS.TRANSCRIBING;

                     // // change handler
                     // console.log('recog changed', (sRecog.status === STATUS.NULL), (sRecog.status === STATUS.AVAILABLE), (control.listening));
                     if (control.listening) {
                        console.log(259, 'start recognition');
                        handler({type: 'START'}); // start recognition
                        copy_sRecog.status = STATUS.TRANSCRIBING;
                     }
                     
                     dispatch({ type: 'sRecog/set_recog', payload: copy_sRecog }); // only dispatch if it is fullfilled
                  })
                  .catch((error_str : string) => {
                     console.log(error_str);
                  });
            })
            .catch((error_str : string) => {
               console.log(error_str);
            });
      } else if (api.currentApi === API.WHISPER) {
         return; // do nothing becuase Whisper is using iframe
      }
   }, [api.currentApi]);
   // TODO: Fix useEffect dependency arrays. Adding recogHandler to the array causes DOM to crash.
   // control recognizer, if listening changed
   useEffect(() => {
      if (!recogHandler) { // whipser won't have recogHandler
         return;
      }
      if (control.listening) {
         recogHandler({type: 'START'});
      } else if (!control.listening) {
         recogHandler({type: 'STOP'}); 
      }
   }, [control.listening]);
   // Webspeech recognizer stops itself after not detecting speech for a while, needs to be restarted
   // restart recognizer, if status not ERROR
   useEffect(() => {
      if (!recogHandler) { // whipser won't have recogHandler
         return;
      }
      // console.log('change recog status: ', sRecog.status);
      if (sRecog.status === STATUS.ENDED) {
         const curTime = Date.now();
         const timeSinceStart = curTime - lastChangeApiTime;
         // console.log(curTime, timeSinceStart);
         if (timeSinceStart > 1000 && control.listening) {
            // console.log(timeSinceStart, control.listening);
            if (recogHandler) recogHandler({type: 'START'});
            setLastChangeApiTime(curTime);
         }
      } else if (sRecog.status === STATUS.ERROR) {
         if (recogHandler) recogHandler({type: 'STOP'});
      }
   }, [sRecog.status]);
   // add phrases
   useEffect(() => {
      console.log(295, azure.phrases);
      if (api.currentApi === API.AZURE_TRANSLATION) {
         if (recogHandler) recogHandler({type: 'CHANGE_PHRASE', payload: azure.phrases});
      }
   }, [azure.phrases]);



   // TODO: whisper's transcript is not in redux store but only in sessionStorage at the moment.
   let transcript : string = useSelector((state: RootState) => {
      const fullTranscript : string = state.TranscriptReducer.previousTranscript[0] 
                                       + ' ' + state.TranscriptReducer.currentTranscript[0];
      return fullTranscript;
   });
   if (api.currentApi === API.WHISPER) { 
      // TODO: inefficient to get it from sessionStorage everytime
      // TODO: add whisper_transcript to redux store after integrating "whisper" folder (containing stream.js) into ScribeAR
      transcript = sessionStorage.getItem('whisper_transcript') || '';
      return { transcript, recogHandler };
   }

   return { transcript, recogHandler };
}
