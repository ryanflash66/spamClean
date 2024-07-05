document.getElementById('cleanSpam').addEventListener('click', async () => {
    try {
        const token = await new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({interactive: true}, (token) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(token);
                }
            });
        });

        const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=in:spam', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const messages = data.messages || [];

        for (const message of messages) {
            await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}/trash`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        alert('Spam emails deleted.');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete spam emails.');
    }
});