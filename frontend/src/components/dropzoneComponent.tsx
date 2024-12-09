import { Grid } from '@mui/material';
import Dropzone from 'react-dropzone';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function DropzoneComponent(props) {
    return (
        <Dropzone
            onDrop={props.onDrop} 
            maxFiles={1}
        // style={{"height": "100%"}}
        >
            {({ getRootProps, getInputProps }) => (
                <section id="dropzone">
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Grid container direction="column" alignItems='center'>
                            <Grid item>
                                <CameraAltIcon fontSize="large" />
                            </Grid>
                            <Grid item>
                                {props.sentence(props.text)}
                            </Grid>
                        </Grid>
                    </div>
                </section>
            )}
        </Dropzone>
    );
}