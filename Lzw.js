// Função para comprimir uma string
const lzw_compress = (string) => {
    if (!string)
        return string

    var dictionary = new Map() // Variavel para salvar o dicionário de caracteres e substrings 
    var data = (string + "").split("") // Transformando a string em um array de caracteres
    var compressed_string = [] // Variavel para salvar a string comprimida
    var currentCharacter // Variavel para guardar o caracter atual ao varrer a string
    var substring = data[0] // Variavel para guardar os pedaços da string que irão ser adicionados no dicionário
    var code = 256 // Variavel para guardar valores ascii 

    // Varrendo o array de caracteres da string
    for (var i = 1; i < data.length; i++) {
        currentCharacter = data[i]

        // Se a substring já constar no dicionário, então junta ela com a o caracter atual
        // Senão, adiciona a substring no dicionário
        if (dictionary.has(substring + currentCharacter)) {
            substring += currentCharacter
        }
        else {
            // Pega o valor da tabela ascii do caracter repetido
            compressed_string.push(substring.length > 1 ? dictionary.get(substring) : substring.charCodeAt(0))
            // Adiciona o caracter ou a substring repetida no dicionário 
            // se for uma substring, guarda pra ela um codigo asciiz para representar os caracteres repetido
            dictionary.set(substring + currentCharacter, code)
            code++
            substring = currentCharacter
        }
    }

    // Junta as substrings não repetidas com o código asciiz das subtrings repetidas
    compressed_string.push(substring.length > 1 ? dictionary.get(substring) : substring.charCodeAt(0))

    // Transforma o código asciiz em palavras
    for (var i = 0; i < compressed_string.length; i++) {
        compressed_string[i] = String.fromCharCode(compressed_string[i])
    }

    return compressed_string.join("")
}

// Função para descomprimir uma string comprimida
const lzw_decompress = (string) => {
    var dictionary = new Map() // Variavel para salvar o dicionário de caracteres e substrings  
    var data = (string + "").split("")  // Transformando a string em um array de caracteres
    var currentCharacter = data[0] // Variavel para guardar o caracter atual ao varrer a string
    var oldSubstring = currentCharacter
    var uncompressed_string = [currentCharacter] // Variavel para salvar a string descomprimida
    var code = 256 // Variavel para guardar valores ascii 
    var substring  // Variavel para guardar os pedaços da string que irão ser adicionados no dicionário

    // Varrendo o array de caracteres da string
    for (var i = 1; i < data.length; i++) {
        var currentCode = data[i].charCodeAt(0) // Transforma o caracter em código ascii

        // Se for uma letra normal então a substring recebe a letra
        // Senão, se for um caracter (feito através de substrings repetidas na compressão), volta ele para substring original
        if (currentCode < 256) {
            substring = data[i] 
        } else {
            substring = dictionary.has(currentCode) ? dictionary.get(currentCode) : (oldSubstring + currentCharacter)
        }
        uncompressed_string.push(substring) // Adiciona na string descomprimida a substring 
        currentCharacter = substring.charAt(0) // Transforma a substring em código asciiz
        dictionary.set(code, oldSubstring + currentCharacter)
        code++
        oldSubstring = substring
    }

    return uncompressed_string.join("")
}

// TESTE VIA PAGINA HTML
const main = () => {
    // Original
    let string = document.getElementById("input-text").value

    // Comprimindo
    let compressed_string = lzw_compress(string)
    document.getElementById("compressed-text").innerHTML = compressed_string

    // Descomprimindo
    let uncompressed_string = lzw_decompress(compressed_string)
    document.getElementById("uncompressed-text").innerHTML = uncompressed_string

    // Calculando a taxa de compressão
    let compression_ratio = uncompressed_string.length / compressed_string.length
    document.getElementById("ratio-text").innerHTML = compression_ratio.toFixed(2).split(".").join(",")
}

//TESTE VIA CONSOLE
// let string = "Loveeeeeeee javascript"
let string = "aaaa"
console.log("Original:", string)

// Comprimindo
compressed_string = lzw_compress(string)
console.log("Comprimida: ", compressed_string)

// Descomprimindo
uncompressed_string = lzw_decompress(compressed_string)
console.log("Descomprimida: ", uncompressed_string)

// Calculando a taxa de compressão
compression_ratio = uncompressed_string.length / compressed_string.length
console.log("Taxa: ", compression_ratio.toFixed(2).split(".").join(","))
