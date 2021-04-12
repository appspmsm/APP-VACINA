import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import AppToolbar from '../components/AppToolbar';
import { Button, ButtonGroup, TextField } from '@material-ui/core';
import { cpfMask, dnMask } from '../util/mask';
import handwriting from '../util/handwriting.canvas';

const useStyles = makeStyles((theme) => ({
    divCenter: {
        width: '100%',
        textAlign: 'center',
    },
    btGroup: {
        paddingTop: '10px'
    },
    textField: {
        display: 'block',
        width: '90%',
        maxWidth: '500px',
        marginLeft:'auto',
        marginRight:'auto'
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
    button: {
        marginTop: '20px'
    }
}));

function CadastroPage(props) {
    const classes = useStyles();
    const history = useHistory();
    const [cpf, setCpf] = React.useState();
    const [nome, setNome] = React.useState('');
    const [dn, setDn] = React.useState();
    const canvas = React.useRef();
    let nameCanvas = React.useRef();;

    const handleCallback = (data, err) => {
        if(err) throw err;
        else {
            console.log(data)
            setNome(data[0]);
        };
    }
    
    useEffect(() => {
        nameCanvas.current = new handwriting.Canvas(canvas.current);
        nameCanvas.current.setLineWidth(3);
        nameCanvas.current.setOptions({
            language: 'pt_BR'
        });
        nameCanvas.current.setCallBack(handleCallback);
    }, [canvas])



    const handleApagarButton = (e) => {
        nameCanvas.current.erase();
    }

    const handleConfirmarButton = (e) => {
        nameCanvas.current.recognize();
    }

    const handleNomeChange = (e) => {
        setNome(e.target.value);
    }

    const handleCPFChange = (e) => {
        e.target.value = cpfMask(e.target.value);
        setCpf(e.target.value.replace(/\D/g, ''));
        console.log(cpf);
    }

    const handleDnChange = (e) => {
        e.target.value = dnMask(e.target.value);
        setDn(e.target.value);
        console.log(dn);
    }

    return (
        <div>
            <AppToolbar backButton logoutButton/>
            <div className={classes.divCenter}>
                <canvas ref={canvas} className={classes.canvas} width={300} height={300}></canvas>
                <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.btGroup}>
                    <Button onClick={handleApagarButton}>Apagar</Button>
                    <Button onClick={handleConfirmarButton}>Confirmar</Button>
                </ButtonGroup>
                <TextField fullWidth className={classes.textField} label="Nome" value={nome} onChange={handleNomeChange}></TextField>
                <TextField fullWidth className={classes.textField} label="Data de Nascimento" inputMode="numeric" onChange={handleDnChange}></TextField>
                <TextField fullWidth className={classes.textField} label="CPF" inputMode="numeric" onChange={handleCPFChange}></TextField>
                <Button variant="contained" color="primary" className={classes.button}>Enviar</Button>
            </div>
            <div>

            </div>
        </div>
    );
}

export default CadastroPage;