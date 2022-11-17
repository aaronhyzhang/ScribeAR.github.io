import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { DisplayStatus, AzureStatus, StreamTextStatus, ControlStatus, ApiStatus } from '../../redux/types';
import { RootState } from '../../store';

import { getAzure, azureRecognition } from './azure/azureRecognition';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { getWebSpeechRecognition, useRecognition } from './web-speech/webSpeechRecognition';

// controls what api to send and what to do when error handling.

// NOTES: this needs to do everything I think. Handler should be returned which allows
//        event call like stop and the event should be returned... (maybe the recognition? idk.)

export const ReturnAPI = (props) => {
    const apiStatus = useSelector((state: RootState) => {
        return state.APIStatusReducer as ApiStatus
    })
    const control = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    });
    const azureStatus = useSelector((state: RootState) => {
        return state.AzureReducer as AzureStatus
    })
    const recognition = getRecognition(apiStatus.currentAPI, azureStatus, control)
    const handler = Handler(apiStatus.currentAPI, recognition) 
    const recognitionBuff = makeRecognition(apiStatus.currentAPI)


    return ({ handler, recognition, recognitionBuff })
}

// Functions for controlling each API as they will be saved to this file.
export const Handler = (currentApi: number, speechRecognition: any) => {
    if (currentApi == 0) { // webspeech
        return useCallback((action) => {
            switch (action.type) {
            case 'STOP':
                speechRecognition!.stop()
                break
            case 'START':
                speechRecognition!.start()
                break
            case 'ABORT':
                speechRecognition!.abort()
                break
            case 'CHANGE_LANGUAGE':
                speechRecognition.lang = action.payload
                break
            default:
                return "poggers";
            }
        }, [])
    } else if (currentApi == 1) { // azure
        return useCallback((action) => {
            switch (action.type) {
            case 'STOP':
                speechRecognition!.stopContinuousRecognitionAsync()
                break
            case 'START':
                speechRecognition!.startContinuousRecognitionAsync()
                break
            case 'ABORT':
                speechRecognition!.close()
                break
            case 'CHANGE_LANGUAGE':
                speechRecognition!.addTargetLanguage(action.payload)
                break
            default:
                return "poggers";
            }    
        }, [])
    } else {
        const streamtextHandler = () => {
            // nothing so far
        }
    }
}

export const getRecognition = (currentApi: number, azure: AzureStatus, control: ControlStatus) => {
    if (currentApi === 0) { // webspeech recognition
        return useMemo(() =>  getWebSpeechRecognition(),[])
    } else if (currentApi === 1) { // azure recognition
        return useMemo(() =>  getAzure(control, azure),[])
    } else {
        return useMemo(() =>  getWebSpeechRecognition(),[])
    }
}

export const makeRecognition = (currentApi: number) => {
    if (currentApi === 0) { // webspeech recognition event controller
        return { useRecognition }
    } else if (currentApi === 1) { // azure recognition event controller
        return { azureRecognition }
    }
}

