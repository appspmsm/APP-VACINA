const cpfMask = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
}

const dnMask = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})\d+?$/, '$1')
}

const telefoneMask = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{0})(\d)/, '$1($2')
      .replace(/(\d{2})(\d)/, '$1)$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{5})\d+?$/, '$1')
}



export {cpfMask, dnMask, telefoneMask};