document.getElementById("year").textContent = new Date().getFullYear();

const copyBtn = document.getElementById("copyPixBtn");
const pixKey = document.getElementById("pixKey");

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (err) {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

copyBtn.addEventListener("click", async () => {
  const text = pixKey.textContent.trim();
  const original = copyBtn.textContent;
  let copied = false;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (err) {
      copied = false;
    }
  }

  if (!copied) {
    copied = fallbackCopy(text);
  }

  if (copied) {
    copyBtn.textContent = "Copiado!";
    setTimeout(() => { copyBtn.textContent = original; }, 2000);
  } else {
    alert("Não foi possível copiar automaticamente. Chave Pix: " + text);
  }
});
