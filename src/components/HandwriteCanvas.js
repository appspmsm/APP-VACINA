import { Button, ButtonGroup, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import handwriting from "../util/handwriting.canvas";

const useStyles = makeStyles((theme) => ({
    btGroup: {
        paddingTop: '10px'
    },
    canvas: {
        display: 'block',
        width: '300px',
        height: '300px',
        border: '2px solid',
        cursor: 'crosshair',
        marginTop: '10px',
        marginLeft:'auto',
        marginRight:'auto'
    },
}));

function HandwriteCanvas(props) {

    const classes = useStyles();
    let canvas = React.useRef();
    //const [canvasData, setCanvasData] = React.useState();
    let handwritingCanvas = React.useRef();

    const handleCallback = (data, err) => {
        if(err) throw err;
        else {
            console.log(data)
        };
    }

    useEffect(() => {
        handwritingCanvas.current = new handwriting.Canvas(canvas.current);
        handwritingCanvas.current.setLineWidth(3);
        handwritingCanvas.current.setOptions({
            language: 'pt_BR'
        });
        handwritingCanvas.current.setCallBack(handleCallback);
    }, [canvas])

    const handleApagarButton = (e) => {
        handwritingCanvas.current.erase();
    }
  
    const handleConfirmarButton = (e) => {
        props.setCanvasData(canvas.current.toDataURL('image/png').split(';base64,')[1]);
    }

    return (
    <div>
        <canvas ref={canvas} className={classes.canvas} width={300} height={300}></canvas>
        <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.btGroup}>
            <Button onClick={handleApagarButton}>Apagar</Button>
            <Button onClick={handleConfirmarButton}>Confirmar</Button>
        </ButtonGroup>
    </div>);
}

export default HandwriteCanvas;