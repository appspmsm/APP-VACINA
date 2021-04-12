import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import AppToolbar from '../components/AppToolbar';
import { Button, ButtonGroup, Container, Step, StepLabel, Stepper, TextField } from '@material-ui/core';
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
        position: 'fixed',
        bottom: 100,
        left: '50%',
        width: 120,
        'margin-left': '-60px'
    },
    stepper: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    buttons: {
        position: 'absolute',
        bottom: 100,
        right: 20
    },
}));

function CadastroPage(props) {
    const classes = useStyles();
    const history = useHistory();
    const [cpf, setCpf] = React.useState('');
    const [nome, setNome] = React.useState('');
    const [dn, setDn] = React.useState('');
    const canvas = React.useRef();
    let nameCanvas = React.useRef();;
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = ['Nome', 'Data de nascimento', 'CPF'];
    const stepSelects = [nome, dn, cpf];

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
        setCpf(e.target.value);
        console.log(cpf);
    }

    const handleDnChange = (e) => {
        e.target.value = dnMask(e.target.value);
        setDn(e.target.value);
        console.log(dn);
    }

    const handleNext = () => {
        setActiveStep((prevStep)=>prevStep+1);
      }
    
      const handleBack = () => {
        setActiveStep((prevStep)=>prevStep+-1);
      }

    function getStepContent(step) {
        switch (step) {
          case 0:
            return (
                <div className={classes.divCenter}>
                <canvas ref={canvas} className={classes.canvas} width={300} height={300}></canvas>
                <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.btGroup}>
                    <Button onClick={handleApagarButton}>Apagar</Button>
                    <Button onClick={handleConfirmarButton}>Confirmar</Button>
                </ButtonGroup>
                <TextField fullWidth className={classes.textField} label="Nome" value={nome} onChange={handleNomeChange}></TextField>
                </div>
            );
          case 1:
            return (
              <div className={classes.divCenter}>
                <TextField fullWidth className={classes.textField} label="Data de Nascimento" inputProps={{ inputMode:"numeric" }} onChange={handleDnChange} value={dn}></TextField>
              </div>
            );
          case 2:
            return (
              <div className={classes.divCenter}>
                  <TextField fullWidth className={classes.textField} label="CPF" inputProps={{ inputMode:"numeric" }} onChange={handleCPFChange} value={cpf}></TextField>
              </div>
            );
          default:
            return 'Unknown step';
        }
      }

    /*return (
        <div>
            <AppToolbar backButton logoutButton/>
            <div className={classes.divCenter}>
                <canvas ref={canvas} className={classes.canvas} width={300} height={300}></canvas>
                <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.btGroup}>
                    <Button onClick={handleApagarButton}>Apagar</Button>
                    <Button onClick={handleConfirmarButton}>Confirmar</Button>
                </ButtonGroup>
                <TextField fullWidth className={classes.textField} label="Nome" value={nome} onChange={handleNomeChange}></TextField>
                <TextField fullWidth className={classes.textField} label="Data de Nascimento" inputProps={{ inputMode:"numeric" }} onChange={handleDnChange}></TextField>
                <TextField fullWidth className={classes.textField} label="CPF" inputProps={{ inputMode:"numeric" }} onChange={handleCPFChange}></TextField>
                <Button variant="contained" color="primary" className={classes.button}>Enviar</Button>
            </div>
            <div>

            </div>
        </div>
    );*/

    return (
        <div>
        <AppToolbar backButton logoutButton/>
        {activeStep === steps.length ? (
            <div>
              <p>Nome: {nome}</p>
              <p>Data de Nascimento: {dn}</p>
              <p>CPF: {cpf}</p>
              <div className={classes.divCenter}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  //onClick={handleConfirmation}
                >Confirmar</Button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{textAlign: "center"}}>{getStepContent(activeStep)}</div>
              <div className={classes.buttons}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Voltar
                </Button>
                <Button
                  disabled={stepSelects[activeStep]===''}
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        
        <div className={classes.stepper}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </div>
      </div>
    );
}

export default CadastroPage;