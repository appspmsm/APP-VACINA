const validateCPF = (strCPF) => {
    strCPF = strCPF.replace(/\D/g, '');
    let soma = 0;
    let resto;
    if (strCPF === "00000000000") return false;

    for (let i=1; i<=9; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11))  resto = 0;
    if (resto !== parseInt(strCPF.substring(9, 10)) ) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11))  resto = 0;
    if (resto !== parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

const validateDate = (strDate) => {
    if ( ! /^\d\d\/\d\d\/\d\d\d\d$/.test(strDate) ) {
        return false;
    }
    const parts = strDate.split('/').map((p) => parseInt(p, 10));
    parts[1] -= 1;
    const d = new Date(parts[2], parts[1], parts[0]);
    return d.getMonth() === parts[1] && d.getDate() === parts[0] && d.getFullYear() === parts[2];
}

const validateTelefone = (strTelefone) => {
    const telefone = strTelefone.replace(/\D/g, '');
    return  telefone.length >= 10;
}

export {validateCPF, validateDate, validateTelefone};