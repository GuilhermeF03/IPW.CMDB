//import document from 'document';

function resizeToFit() {
    const text = document.querySelector(".resizable")
    const textContainer = document.querySelector(".info-panel-content-container");

    let fontSize = window.getComputedStyle(text).fontSize;
    console.log(fontSize);
    text.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
    
    if(text.clientHeight >= textContainer.clientHeight)
      resizeToFit();
    text.addEventListener('onChange')
  }

  
