import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import AppToolbar from '../components/AppToolbar';
import { Button, ButtonGroup, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Hidden, Step, StepLabel, Stepper, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { cpfMask, dnMask } from '../util/mask';
import handwriting from '../util/handwriting.canvas';
import { getURL } from '../adapters/api-planilha';
import HandwriteCanvas from '../components/HandwriteCanvas';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import Dexie from 'dexie';
import { validateCPF, validateDate } from '../util/validacao';

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
    kbTheme: {
      fontSize: '23px'
    },
    error: {
      color: 'red'
    },
    progress: {
      color: 'blue',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
  },
}));

function CadastroPage(props) {
    const classes = useStyles();
    const history = useHistory();
    const [cpf, setCpf] = React.useState('');
    const [nome, setNome] = React.useState('');
    const [dn, setDn] = React.useState('');
    const [cpfError, setCpfError] = React.useState(false);
    const [dnError, setDnError] = React.useState(false);
    const [canvas, setCanvas] = React.useState();
    const [canvasData, setCanvasData] = React.useState();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = ['Nome', 'Data de nascimento', 'CPF', 'Assinatura'];
    const stepSelects = [nome, dn, cpf];
    const nameKb = React.useRef();
    const [layout, setLayout] = React.useState("default");
    const [inputName, setInputName] = React.useState("nameInput");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [token, setToken] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const matches = useMediaQuery('(min-height:590px)');
    const db = new Dexie('Cadastros');
    db.version(1).stores({
      cadastros: '++id, cpf, status'
    });
    
    useEffect(() => {
      const lsToken = localStorage.getItem('token');
      if(!lsToken){
        history.push('/');
      }else{
        setToken(lsToken);
      }
    }, [])

    const handleNomeChange = (e) => {
        setNome(e.target.value);
        nameKb.current.setInput(e.target.value);
    }

    const handleCPFChange = (e) => {
      console.log(e.target.value);
        e.target.value = cpfMask(e.target.value);
        if(e.target.value.length === 14 && validateCPF(e.target.value)){
          setCpfError(true);
        }
        setCpf(e.target.value);
    }

    const handleDnChange = (e) => {
        console.log(e.target.value);
        e.target.value = dnMask(e.target.value);
        console.log(e.target.value);
        if(e.target.value.length === 8 && validateDate(e.target.value)){
          setDnError(true);
        }
        setDn(e.target.value);
    }

    const handleNext = () => {
      if(activeStep === 3){
        setCanvasData(canvas.current.toDataURL('image/png').split(';base64,')[1]);
      }
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

    const addCadastroIdb = (status) => {
      return db.cadastros.add({
        nome: nome,
        dn: dn,
        cpf: cpf,
        assinatura: canvasData,
        time: new Date(Date.now()).toLocaleString('pt-BR', {timeZone:'America/Sao_Paulo'}),
        status: status,
        token: token
      })
    }

    const handleConfirmation = () => {
      if(nome && validateDate(dn) && validateCPF(cpf) && canvasData){
        setLoading(true);
        const params = new URLSearchParams();
        params.append('token', token);
        params.append('nome', nome);
        params.append('dn', dn);
        params.append('cpf', cpf);
        params.append('type', 'setCadastro');
        params.append('assinatura', canvasData);
        params.append('time', new Date(Date.now()).toLocaleString('pt-BR', {timeZone:'America/Sao_Paulo'}))
        fetch(getURL(), {
          method: 'post',
          redirect: 'follow',
          body: params
        }).then((response) => {
          response.json().then((json) => {
            if(json.success){
              addCadastroIdb('ok');
              setLoading(false);
              history.push('/cadastros');
            }else{
              //requisição invalida
            }
          })
        }).catch(err => {
          console.log(err);
          addCadastroIdb('pend').then(response => {
              if('serviceWorker' in navigator && 'SyncManager' in window) {
                  navigator.serviceWorker.ready.then(function(reg) {
                    reg.sync.register('sendCadastros');
                    setLoading(false);
                    history.push('/cadastros');
                  }).catch((e) => {
                    // system was unable to register for a sync,
                    // this could be an OS-level restriction
                    setLoading(false);
                    alert('Não foi possível armazenar o cadastro para envio offline');
                  });
                } else {
                  // serviceworker/sync not supported
                  setLoading(false);
                  alert('Não foi possível armazenar o cadastro para envio offline');
                }
              }
          ).catch((e)=>{
            setLoading(false);
            alert('Não foi possível armazenar o cadastro para envio offline');
          });
        });
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
          const maskdn = dnMask(input);
          if(maskdn.length === 10 && !validateDate(maskdn)){
            setDnError(true);
          }else if(maskdn.length < 10 || validateDate(maskdn)){
            setDnError(false);
          }
          setDn(maskdn);
          break;
        case 2:
          const maskcpf = cpfMask(input);
          if(maskcpf.length === 14 && !validateCPF(maskcpf)){
            setCpfError(true);
          }else if(maskcpf.length < 14 || validateCPF(maskcpf)){
            setCpfError(false);
          }
          setCpf(maskcpf);
          break;
        default: break;
      }
      
    }

    const kbOnKeyPress = (button) => {
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
                  <TextField fullWidth id="nameInput" className={classes.textField} label="Nome" value={nome} inputProps={{ inputMode:"none", style:{fontSize:'23px'}}} onChange={handleNomeChange}></TextField>
                </div>
            );
          case 1:
            return (
              <div className={classes.divCenter}>
                <TextField 
                error={dnError}
                fullWidth 
                id="dnInput" 
                className={classes.textField} 
                label="Data de Nascimento"
                helperText={dnError ? "Data inválida." : ""}
                inputProps={{ inputMode:"none", style:{fontSize:'23px'}}} 
                onChange={handleDnChange} 
                value={dn}>
                </TextField>
              </div>
            );
          case 2:
            return (
              <div className={classes.divCenter}>
                  <TextField 
                  error={cpfError}
                  fullWidth 
                  id="cpfInput" 
                  className={classes.textField} 
                  label="CPF" 
                  helperText={cpfError ? "CPF inválido." : ""}
                  inputProps={{ inputMode:"none", style:{fontSize:'23px'}}} 
                  onChange={handleCPFChange} 
                  value={cpf}></TextField>
              </div>
            );
          case 3:
            return (
              <div className={classes.divCenter}>
                  <HandwriteCanvas setCanvas={setCanvas}></HandwriteCanvas>
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
        <AppToolbar backButton logoutButton/>
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
              <Button disabled={loading} onClick={handleBack}>
                  Voltar
                </Button>
                <Button
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={handleConfirmation}
                >Confirmar</Button>
                 {loading && <CircularProgress size={24} className={classes.progress} />}
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
            shift:[
              "q w e r t y u i o p", 
              "a s d f g h j k l ç", 
              "z x c v b n m {backspace}",
              "{shift} {space} {prox}"
            ],
            default:[
              "Q W E R T Y U I O P", 
              "A S D F G H J K L Ç", 
              "Z X C V B N M {backspace}",
              "{space} [{prox}]"
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
          buttonAttributes={[
            {
              attribute: 'style',
              value: 'flex-basis:68%',
              buttons: '{space} 0'
            }
          ]}
          theme={classes.kbTheme + " hg-theme-default"}
          layoutName={layout}
          onChange={kbOnChange}
          onKeyPress={kbOnKeyPress}
          keyboardRef={r => (nameKb.current = r)}
          inputName={inputName}
          useMouseEvents={true}
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