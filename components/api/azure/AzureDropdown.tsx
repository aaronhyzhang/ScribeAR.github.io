import * as React from 'react';
import swal from 'sweetalert';
import { Box, TextField, List, ListItem } from '../../../muiImports'
import { GetAzureRecognition } from './azureRecognition';
import { ApiStatus, AzureStatus, ControlStatus } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';


enum STATUS {
    "AVAILABLE",
    "NULL",
    "UNAVAILABLE",
    "INPROGRESS",
    "ERROR"
}

export default function AzureDropdown(props) {
    const dispatch = useDispatch()
    const { pog, test } = GetAzureRecognition();

    const [state, setState] = React.useState({
        openAzure: false,
        azureStatus: useSelector((state: RootState) => {
            return state.AzureReducer as AzureStatus;
        }),
        controlStatus: useSelector((state: RootState) => {
            return state.ControlReducer as ControlStatus;
        }),
        apiStatus: props.apiStatus as ApiStatus
    });
    const handleChangeKey = (event) =>
     {
            let copyStatus = Object.assign({}, state.azureStatus);
            copyStatus[event.target.id] = event.target.value;
            setState({
                ...state, 
                azureStatus: copyStatus});
            dispatch({type: 'CHANGE_AZURE_LOGIN', payload: copyStatus})
            
    } 
    const handleEnter = (event) =>
    {
      if (event.key === 'Enter') {
        toggleEnter()
        event.preventDefault();
      }
    }
    // const isLoggedIn = useSelector(state: RootState => state.user.loggedIn);

    const toggleEnter = async () => {
        dispatch({type: 'FLIP_RECORDING', payload: state.controlStatus})
          const recognizedMessage = await test(state.controlStatus, state.azureStatus).then(response => {  
            let copyStatus = Object.assign({}, state.apiStatus);
            if (response === true) {
              copyStatus.azureStatus = 0;
              localStorage.setItem("azureStatus", JSON.stringify(state.azureStatus))
              swal({
                title: "Success!",
                text: "Switching to Microsoft Azure",
                icon: "success", 
                timer: 1500,
                buttons: {
                  no: {
                    text: "Cancel",
                    value: "no",
                  },    
                },
              })
              .then((value) => {
                switch (value) {
                  case "no":
                    setState({ ...state, openAzure: false })
                    break;
                  default:
                    copyStatus.currentAPI = 1;
                    dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
                }
              });
              setState({
                ...state, 
                apiStatus: copyStatus});
            } else {
              copyStatus.azureStatus = 2;   
              swal({
                title: "Warning!",
                text: "Wrong key or region!",
                icon: "warning",
              })
              setState({
                ...state, 
                apiStatus: copyStatus});     
            }

            dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
    
          }
        );  
        dispatch({type: 'FLIP_RECORDING', payload: state.controlStatus})
    }
    
    return (
        <div>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { pr: '1vw', width: '15vw' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                          <style>
                            {`
                              #azureKey {
                                width: '100%';
                              }
                            `}
                          </style>
                          <TextField onKeyDown = {handleEnter} onChange={handleChangeKey} value={state.azureStatus.azureKey} id="azureKey" label="Key" variant="outlined" style={{ width: '100%' }}/>
                          </Box>
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { mr: '1vw', width: '15vw' },
                            }}
                            noValidate
                            autoComplete="off"
                        ><TextField onKeyDown = {handleEnter} onChange={handleChangeKey} value={state.azureStatus.azureRegion} id="azureRegion" label="Region" variant="outlined" style={{ width: '100%' }}/></Box>
                    </ListItem>
                </List>
        </div>
    );
}