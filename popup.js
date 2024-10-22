document.addEventListener('DOMContentLoaded', function() {
    const moreDetailInput = document.getElementById('moreDetail');
        const submitButton = document.getElementById('submitButton');
        const loaderImage = document.getElementById('loaderImage');
        const modeSwitch = document.getElementById('modeSwitch');
        const copyImage = document.getElementById('copyImage');
        const responseContent = document.getElementById('responseContent');
        const apiResponse = document.getElementById('apiResponse');

        // Load saved mode from localStorage
        const savedMode = localStorage.getItem('mode') || 'light-mode';
        document.body.className = savedMode;
        modeSwitch.checked = savedMode === 'dark-mode';

        moreDetailInput.addEventListener('input', function() {
            submitButton.disabled = this.value.trim() === '';
        });

        modeSwitch.addEventListener('change', function() {
            const newMode = this.checked ? 'dark-mode' : 'light-mode';
            document.body.className = newMode;
            localStorage.setItem('mode', newMode);
        });

        copyImage.addEventListener('click', function() {
            navigator.clipboard.writeText(responseContent.textContent).then(() => {
                copyImage.classList.add('copy-animation');
                setTimeout(() => {
                    copyImage.classList.remove('copy-animation');
                }, 500);
            });
        });

        document.getElementById('apiForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const promptObjective = document.getElementById('promptObjective').value;
            const moreDetail = moreDetailInput.value;
            
            const data = {
                id: "df0f205411fbfe8601f7ffb6e1e4240c",
                formId: "mwai-671622587574b",
                session: "65efb74978318",
                contextId: 6,
                stream: false,
                fields: {
                    PROMPT_OBJECTIVE: promptObjective,
                    MORE_DETAIL: moreDetail
                }
            };

            submitButton.disabled = true;
            loaderImage.style.display = 'inline-block';

            fetch('https://prompt-helper.com/wp-json/mwai-ui/v1/forms/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'DNT': '1',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.reply) {
                    const formattedReply = data.reply
                        .replace(/(\d+\))\s*([^\n]+)/g, '<span class="highlight">$1 $2</span><br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    responseContent.innerHTML = formattedReply;
                    apiResponse.style.display = 'block';
                } else {
                    throw new Error('No reply in the API response');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                responseContent.textContent = 'Error: ' + error.message;
                apiResponse.style.display = 'block';
            })
            .finally(() => {
                submitButton.disabled = false;
                loaderImage.style.display = 'none';
            });
        });
});