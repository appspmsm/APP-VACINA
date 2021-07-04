const getIdade = (strDn) => {
    const parts = strDn.split('/').map((p) => parseInt(p, 10));
    parts[1] -= 1;
    const dn = new Date(parts[2], parts[1], parts[0]);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dn.getFullYear();
    if(hoje.getMonth() < dn.getMonth() || (hoje.getMonth() === dn.getMonth() && hoje.getDate() < dn.getDate())){
        idade -= 1;
    }
    return idade;
}

const getFaixaEtaria = (strDn) => {
    const idade = getIdade(strDn);
    if(idade >= 18 && idade <=64){
        return 'Pessoas de 18 a 64 anos'
    }else if(idade > 64 && idade <= 69){
        return 'Pessoas de 65 a 69 anos'
    }else if(idade > 69 && idade <= 74){
        return 'Pessoas de 70 a 74 anos'
    }else if(idade > 74 && idade <= 79){
        return 'Pessoas de 75 a 79 anos'
    }else if(idade >= 80){
        return 'Pessoas de 80 anos ou mais'
    }else{
        return ''
    }
}

export {getIdade, getFaixaEtaria};