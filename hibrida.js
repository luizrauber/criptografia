// Exemplo de Criptografia Híbrida
async function runHybrid() {
    const outputId = "output-hybrid";
    document.getElementById(outputId).innerHTML = ""; // Limpar saída
  
    appendOutput(outputId, "Gerando par de chaves RSA...");
  
    // Gerar par de chaves RSA
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt", "decrypt"]
    );
  
    appendOutput(outputId, "Gerando chave AES e vetor de inicialização (IV)...");
  
    // Gerar chave AES e vetor de inicialização (IV)
    const aesKey = crypto.getRandomValues(new Uint8Array(32)); // Chave simétrica (256 bits)
    const iv = crypto.getRandomValues(new Uint8Array(16)); // Vetor de inicialização (128 bits)
  
    const message = "Mensagem secreta";
    appendOutput(outputId, `Mensagem original: ${message}`);
  
    // Criptografar mensagem com AES
    appendOutput(outputId, "Criptografando a mensagem com AES...");
    
    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      await window.crypto.subtle.importKey("raw", aesKey, { name: "AES-CBC" }, false, ["encrypt"]),
      new TextEncoder().encode(message)
    );
  
    appendOutput(outputId, `Mensagem criptografada com AES (hex): ${Array.from(new Uint8Array(encryptedMessage)).map(b => b.toString(16).padStart(2, '0')).join('')}`);
  
    // Criptografar chave AES com RSA (chave pública)
    appendOutput(outputId, "Criptografando a chave AES com a chave pública RSA...");
    
    const encryptedAesKey = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      keyPair.publicKey,
      aesKey
    );
  
    appendOutput(outputId, `Chave AES criptografada com RSA (hex): ${Array.from(new Uint8Array(encryptedAesKey)).map(b => b.toString(16).padStart(2, '0')).join('')}`);
  
    // Descriptografar chave AES com RSA (chave privada)
    appendOutput(outputId, "Descriptografando a chave AES com a chave privada RSA...");
    
    const decryptedAesKey = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      keyPair.privateKey,
      encryptedAesKey
    );
  
    appendOutput(outputId, `Chave AES descriptografada (hex): ${Array.from(new Uint8Array(decryptedAesKey)).map(b => b.toString(16).padStart(2, '0')).join('')}`);
  
    // Descriptografar mensagem com AES
    appendOutput(outputId, "Descriptografando a mensagem com AES...");
    
    const decryptedMessage = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      await window.crypto.subtle.importKey("raw", decryptedAesKey, { name: "AES-CBC" }, false, ["decrypt"]),
      encryptedMessage
    );
  
    appendOutput(outputId, `Mensagem descriptografada: ${new TextDecoder().decode(decryptedMessage)}`);
  }
  