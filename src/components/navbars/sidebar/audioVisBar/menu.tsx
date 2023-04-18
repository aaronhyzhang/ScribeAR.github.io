import React from 'react';

import { List, ListItemText, Collapse, ListItem, EqualizerIcon } from '../../../../muiImports';
import ShowFrequency from './showFrequency';
import ShowTimeData from './showTimeData';
import ShowMFCC from './showMFCC';
import ShowSpeaker from './showSpeaker';
import ShowIntent from './showIntent';


export default function VisualizationMenu(props) {

   return (
      <div>
         {props.listItemHeader("Visualization", "visualization", EqualizerIcon)}

         <Collapse in={props.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Frequency" />
                  <ShowFrequency />
               </ListItem>
               {/* <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Labels" />
                  <ShowLabels />
               </ListItem> */}
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Time Data" />
                  <ShowTimeData />
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show MFCC" />
                  <ShowMFCC />
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Speaker" />
                  <ShowSpeaker />
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Intent" />
                  <ShowIntent />
               </ListItem>
            </List>
         </Collapse>
      </div>
   );
}