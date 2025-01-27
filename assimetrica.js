// Exemplo de Criptografia Assimétrica
async function runAsymmetric() {
    const outputId = "output-asymmetric";
    document.getElementById(outputId).innerHTML = ""; // Limpar saída
  
    appendOutput(outputId, "Gerando par de chaves RSA...");
  
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
  
    const message = "Mensagem secreta";
    appendOutput(outputId, `Mensagem original: ${message}`);
  
    // Criptografar com a chave pública
    appendOutput(outputId, "Criptografando a mensagem com a chave pública...");
  
    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      keyPair.publicKey,
      new TextEncoder().encode(message)
    );
  
    appendOutput(outputId, `Mensagem criptografada (hex): ${Array.from(new Uint8Array(encryptedMessage)).map(b => b.toString(16).padStart(2, '0')).join('')}`);
  
    // Descriptografar com a chave privada
    appendOutput(outputId, "Descriptografando a mensagem com a chave privada...");
  
    const decryptedMessage = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      keyPair.privateKey,
      encryptedMessage
    );
  
    appendOutput(outputId, `Mensagem descriptografada: ${new TextDecoder().decode(decryptedMessage)}`);
  }
  