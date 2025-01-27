// Função para exibir mensagens no output
function appendOutput(id, message) {
    const outputDiv = document.getElementById(id);
    outputDiv.innerHTML += `<p>${message}</p>`;
  }
  
  // Exemplo de Criptografia Simétrica
  async function runSymmetric() {
    const outputId = "output-symmetric";
    document.getElementById(outputId).innerHTML = ""; // Limpar saída
  
    appendOutput(outputId, "Gerando chave AES e vetor de inicialização (IV)...");
    const key = crypto.getRandomValues(new Uint8Array(32)); // Chave de 256 bits
    const iv = crypto.getRandomValues(new Uint8Array(16)); // IV de 128 bits
  
    const message = "Mensagem secreta";
    appendOutput(outputId, `Mensagem original: ${message}`);
  
    // Criptografar
    appendOutput(outputId, "Criptografando a mensagem...");
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);
  
    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      await window.crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, false, ["encrypt"]),
      encodedMessage
    );
  
    appendOutput(outputId, `Mensagem criptografada (hex): ${Array.from(new Uint8Array(encryptedMessage)).map(b => b.toString(16).padStart(2, '0')).join('')}`);
  
    // Descriptografar
    appendOutput(outputId, "Descriptografando a mensagem...");
  
    const decryptedMessage = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      await window.crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, false, ["decrypt"]),
      encryptedMessage
    );
  
    appendOutput(outputId, `Mensagem descriptografada: ${new TextDecoder().decode(decryptedMessage)}`);
  }
  