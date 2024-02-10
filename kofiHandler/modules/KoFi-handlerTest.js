function funzioneTest(message){
  regex = /Ehy\s(.+)!!\sGrazie\sper\sla\sdonazione\sdi\s(\d+.\d+€)!!/; //Ehy Someone!! Grazie per la donazione di 3.00€!!
    let match = message.match(regex);
    let donator; // User that donated money
    let amount; // String with the amount donated (currency included)
    let crudeNum;
    if (match) {
        donator = match[1];
        amount = match[2];
        crudeNum = parseFloat(amount.slice(0, -1));
        document.getElementById("username").innerHTML = donator;
        document.getElementById("amount").innerHTML = amount;
    }
    const tl = gsap.timeline({repeat:0, repeatDelay:0, yoyo:false});
    tl.to("#alert_widget-container", {duration: 0, opacity:"0"})
      .to("#alert_widget-container", {duration: 0, className:"animate__animated animate__bounceIn", delay:0})
      .to("#alert_widget-container", {duration: 5, opacity:"1", delay: 0}, "-=1")
      .to("#alert_widget-container", {duration: 0, className:"animate__animated animate__bounceOut", delay:0})
      .to("#alert_widget-container", {duration: 0, opacity:"0"})
}