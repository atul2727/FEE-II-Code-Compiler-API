
const codeEditor = document.getElementById('code-editor');
const languageSelect = document.getElementById('language-select');
const outputConsole = document.getElementById('output-console');
const compileBtn = document.getElementById('compile-btn');

compileBtn.addEventListener('click', () => {
    const code = codeEditor.value;
    const langId = languageSelect.value;

    // Send code to server
    fetch('https://codequotient.com/api/executeCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, langId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            outputConsole.textContent = `Error: ${data.error}`;
        } else {
            const codeId = data.codeId;
            checkResult(codeId);
        }
    })
    .catch(error => {
        outputConsole.textContent = `Error: ${error.message}`;
    });
});

function checkResult(codeId) {
    const intervalId = setInterval(() => {
        fetch(`https://codequotient.com/api/codeResult/${codeId}`)
            .then(response => response.json())
            .then(data => {
                if (data.data && (data.data.output || data.data.errors)) {
                    clearInterval(intervalId);
                    if (data.data.output) {
                        outputConsole.textContent = `Output: ${data.data.output}`;
                    } else {
                        outputConsole.textContent = `Error: ${data.data.errors}`;
                    }
                }
            })
            .catch(error => {
                clearInterval(intervalId);
                outputConsole.textContent = `Error: ${error.message}`;
            });
    }, 1000);
}