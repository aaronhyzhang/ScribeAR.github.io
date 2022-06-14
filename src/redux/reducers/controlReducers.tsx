import { ControlStatus } from "../types";

const initialControlState : ControlStatus = {
    listening: true,
    visualizing: true,
    showFrequency: false,
    speechLanguage: "en-US",
    textLanguage: "en"
}

export function ControlReducer(state = initialControlState, action) {
  switch (action.type) {
    case 'FLIP_RECORDING':
      return { ...state, ...action.payload};
    case 'FLIP_VISUALIZING':
      return { ...state, visualizing: !state.visualizing};
    case 'FLIP_SHOWFREQ':
      return { ...state, showFrequency: !state.showFrequency};
    case 'FLIP_RECORDING_PHRASE':
      return { ...state,
              listening: action.payload};
    case 'SET_SPEECH_LANGUAGE':
        return {
          ...state,
          speechLanguage: action.payload};
    case 'SET_TEXT_LANGUAGE':
        return {
          ...state,
        textLanguage: action.payload};
    default:
      return state;
  }
}