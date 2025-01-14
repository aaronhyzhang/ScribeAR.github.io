/**
 * A recognizer is an abstract object that has the following functions
 * 
 * void start()
 *      Makes the recognizer starts transcribing speech from given audio source
 * 
 * void stop()
 *      Makes the recognizer stops transcribing speech
 * 
 * void onTranscribed(transcript -> void function Callback)
 *      Subscribes a callback function to the transcript update event, which is triggered
 *      when the transcript has been updated due to more speech being transcribed
 *      (What type is appropriate for representing transcript? plain string?)
 * 
 * void onError(error -> void function Callback)
 *      Subscribes a callback function to the recognizer error event, which is triggered
 *      when the recognizer encouters an error (that may or may not be fatal)
 * 
 * (Should there be an event handler for unexpected stop like one caused by fatal error?)
 * 
 * Further, it should be instantiated by the following function:
 * 
 * Recognizer createRecognizer(enum? audioSource, string? language)
 *      Constructor that creates a recognizer instance ready to be started using the given args
 *      (Are args necessary? Should CreateRecognizer directly fetch from Redux store?)
 *      (What types are appropriate for representing audio source and language?)
 */

/**
 * The transcript of a continuous segment of speech, represented by one or more 
 * Finalized transcript blocks followed by an in-progress block.
 * 
 * Each block is the transcript of a sub-segment of speech, in chronological order, and the
 * Complete transcript is the concatenation of all blocks:
 * 
 * final_0 -> final_1 ->...-> final_n -> in_progress
 * 
 */
export class Transcript {
    finalBlocks: Array<string> = [];
    inProgressBlock: string = "";
}

/**
 * Abstract recognizer interface that describes an async speech recognizer that converts
 * speech to transcript
 */
export interface Recognizer{
    // TODO: create audio source type

    /**
     * Makes the recognizer start transcribing speech asynchronously
     * 
     * Throws exception if recognizer fails to start
     */
    start();

    /**
     * Makes the recognizer stop transcribing speech asynchronously
     * 
     * Throws exception if recognizer fails to stop
     */
    stop();

    /**
     * Subscribe a callback function to the transcript update event, which is usually triggered
     * when the recognizer has processed more speech
     * @param callback A callback function called with the latest transcript when the event is triggered
     */
    onTranscribed(callback: (transcript: Transcript) => void);

    /**
     * Subscribe a callback function to the error event, which is triggered
     * when the recognizer has encountered an error that it cannot handle
     * @param callback A callback function called with the error object when the event is triggered
     */
    onError(callback: (e: Error) => void);
}

