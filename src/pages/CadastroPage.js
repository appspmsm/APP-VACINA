import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import AppToolbar from '../components/AppToolbar';
import { Button, ButtonGroup, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Hidden, Step, StepLabel, Stepper, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { cpfMask, dnMask } from '../util/mask';
import handwriting from '../util/handwriting.canvas';
import { getURL } from '../adapters/api-planilha';
import HandwriteCanvas from '../components/HandwriteCanvas';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";

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
    buttons: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        width: 200,
        'margin-left': '-100px'
    },
    stepper: {
        width: '100%'
    },
    keyboard: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
    },
    error: {
      color: 'red'
    }
}));

function CadastroPage(props) {
    const classes = useStyles();
    const history = useHistory();
    const [cpf, setCpf] = React.useState('');
    const [nome, setNome] = React.useState('');
    const [dn, setDn] = React.useState('');
    const canvas = React.useRef();
    const canvasAssinatura = React.useRef();
    let nameCanvas = React.useRef();
    let assinaturaCanvas = React.useRef();
    const [canvasData, setCanvasData] = React.useState();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = ['Nome', 'Data de nascimento', 'CPF', 'Assinatura'];
    const stepSelects = [nome, dn, cpf];
    const nameKb = React.useRef();
    const [layout, setLayout] = React.useState("default");
    const [inputName, setInputName] = React.useState("nameInput");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const matches = useMediaQuery('(min-height:590px)');
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if(!token){
        history.push('/');
      }
    }, [])

    const handleNomeChange = (e) => {
        setNome(e.target.value);
        nameKb.current.setInput(e.target.value);
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
        setInputName(getInputName(activeStep+1));
        setActiveStep((prevStep)=>prevStep+1);
        setLayout('numeric');
      }
    
    const handleBack = () => {
      setInputName(getInputName(activeStep-1));
      if(activeStep === 1) {
        setLayout('default');
      }
      setActiveStep((prevStep)=>prevStep+-1);
    }

    const getInputName = (step) => {
      switch(step) {
        case 0: return 'nameInput';
        case 1: return 'nameDn';
        case 2: return 'nameCpf';
        default: break;
      }
    }

    const handleConfirmation = () => {
      if(nome && dn.length === 10 && cpf.length === 14 && canvasData){
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        params.append('token', token);
        params.append('nome', nome);
        params.append('dn', dn);
        params.append('cpf', cpf);
        params.append('type', 'setCadastro');
        params.append('assinatura', canvasData);
        fetch(getURL(), {
          method: 'post',
          redirect: 'follow',
          body: params
        }).then((response) => response.json().then((json) => {
          if(json.success){
            console.log(json);
          }
        }));
      }else{
        setDialogOpen(true);
      }
    }

    const kbOnChange = (input) => {
      switch(activeStep){
        case 0: 
          setNome(input);
          break;
        case 1: 
          setDn(dnMask(input));
          break;
        case 2:
          setCpf(cpfMask(input));
          break;
        default: break;
      }
      
    }

    const kbOnKeyPress = (button) => {
      if(button !== '{shift}' && layout === 'shift'){
        handleShift();
      }
      switch(button){
        case '{prox}':
          handleNext();
          break;
        case '{volt}':
          handleBack();
          break;
        case '{shift}':
          handleShift();
          break;
        default: break;
      }
    }

    const handleShift = () => {
      console.log(layout);
      const newLayoutName = layout === "default" ? "shift" : "default";
      console.log(newLayoutName)
      setLayout(newLayoutName);
    };

    const handleDialogClose = () => {
      setDialogOpen(false);
    }

    function getStepContent(step) {
        switch (step) {
          case 0:
            return (
                <div className={classes.divCenter}>
                  <TextField fullWidth id="nameInput" className={classes.textField} label="Nome" value={nome} inputProps={{ inputMode:"none" }} onChange={handleNomeChange}></TextField>
                </div>
            );
          case 1:
            return (
              <div className={classes.divCenter}>
                <TextField fullWidth id="dnInput" className={classes.textField} label="Data de Nascimento" inputProps={{ inputMode:"none" }} onChange={handleDnChange} value={dn}></TextField>
              </div>
            );
          case 2:
            return (
              <div className={classes.divCenter}>
                  <TextField fullWidth id="cpfInput" className={classes.textField} label="CPF" inputProps={{ inputMode:"none" }} onChange={handleCPFChange} value={cpf}></TextField>
              </div>
            );
          case 3:
            return (
              <div className={classes.divCenter}>
                  <HandwriteCanvas setCanvasData={setCanvasData}></HandwriteCanvas>
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
        <AppToolbar logoutButton/>
        {matches &&
          <div className={classes.stepper}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => {
                const stepProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </div>}
        {activeStep === steps.length ? (
            <div>
              <Typography>Nome: {nome ? nome : <span className={classes.error}>Não Preenchido</span>}</Typography>
              <Typography>Data de Nascimento: {dn ? dn : <span className={classes.error}>Não Preenchido</span>}</Typography>
              <Typography>CPF: {cpf ? cpf : <span className={classes.error}>Não Preenchido</span>}</Typography>
              <Typography>Assinatura: {!canvasData && <span className={classes.error}>Não assinado</span>}</Typography>
              <div>
                {canvasData && <img src={'data:image/png;base64,' + canvasData} alt="assinatura"></img>}
              </div>
              <div className={classes.buttons}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                  Voltar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={handleConfirmation}
                >Confirmar</Button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{textAlign: "center"}}>{getStepContent(activeStep)}</div>
              
          </div>
          )}
          {activeStep < 3 && <div className={classes.keyboard}>
        <Keyboard
          layout={{
            default:[
              "q w e r t y u i o p", 
              "a s d f g h j k l ç", 
              "z x c v b n m {backspace}",
              "{shift} {space} {prox}"
            ],
            shift:[
              "Q W E R T Y U I O P", 
              "A S D F G H J K L Ç", 
              "Z X C V B N M {backspace}",
              "{shift} {space} {prox}"
            ],
            numeric:[
              "1 2 3",
              "4 5 6",
              "7 8 9",
              "0 {backspace}",
              "{volt} {prox}"
            ]
          }}
          display={{
            "{shift}": "⇧",
            "{prox}": "Próximo",
            "{volt}": "Voltar",
            "{space}": " ",
            "{backspace}": "⌫"
          }}
          layoutName={layout}
          onChange={kbOnChange}
          onKeyPress={kbOnKeyPress}
          keyboardRef={r => (nameKb.current = r)}
          inputName={inputName}
        />
        </div>} 
        <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Erro no cadastro"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Informe nome, data de nascimento, CPF e assinatura.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
              
      </div>
    );
}

export default CadastroPage;