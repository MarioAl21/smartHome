function toggleInfoMessage() {
    const infoMessage = document.getElementById('infoMessage');
    infoMessage.style.display = infoMessage.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('infoIcon').addEventListener('click', toggleInfoMessage);
