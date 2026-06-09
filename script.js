document.addEventListener("DOMContentLoaded", () => {
    const envelopeBlock = document.getElementById("envelope-block");
    const mainCard = document.getElementById("main-card");
    const btnSim = document.getElementById("btn-sim");
    const btnNao = document.getElementById("btn-nao");
    const catImg = document.getElementById("cat-img");
    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const question = document.getElementById("question");
    const sndErro = document.getElementById("snd-erro");
    const sndGato = document.getElementById("snd-gato");
    const sndMusica = document.getElementById("snd-musica");
    const sndMusicaFeliz = document.getElementById("snd-musica-feliz");
    const volumeSlider = document.getElementById("volume-slider");
    const volumeIcon = document.getElementById("volume-icon");
    const rainContainer = document.getElementById("rain-container");
    const flowerField = document.getElementById("flower-field");
    const loveModal = document.getElementById("love-modal");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const finalLetterText = document.getElementById("final-letter-text");

    let escalaSim = 1; 
    let aceitou = false;
    let envelopeAberto = false;
    
    const textoMensagemCard = "Por favor, pensa com carinho em tudo o que vivemos. Eu sei o quanto você é incrível e quero fazer tudo dar certo dessa vez.";
    const textoOriginalCartaFinal = finalLetterText.innerText;
    finalLetterText.innerText = ""; // Efeito surpresa: Limpa para digitar ao vivo

    // --- CHUVA TRISTE INICIAL ---
    function criarChuva() {
        for (let i = 0; i < 22; i++) {
            const drop = document.createElement("div");
            drop.classList.add("drop");
            drop.style.left = Math.random() * 100 + "vw";
            drop.style.top = Math.random() * -50 + "px";
            drop.style.animationDelay = Math.random() * 2 + "s";
            drop.style.animationDuration = Math.random() * 1 + 1 + "s";
            rainContainer.appendChild(drop);
        }
    }
    criarChuva();

    // --- GERAR FLORES NO FUNDO ---
    function criarFloresFundo() {
        const flores = ["🌸", "💮", "✨", "🍃"];
        for (let i = 0; i < 15; i++) {
            const fl = document.createElement("div");
            fl.classList.add("bg-flower");
            fl.innerText = flores[Math.floor(Math.random() * flores.length)];
            fl.style.left = Math.random() * 90 + "vw";
            fl.style.top = Math.random() * 90 + "vh";
            fl.style.animationDelay = Math.random() * 4 + "s";
            flowerField.appendChild(fl);
        }
    }
    criarFloresFundo();

    // --- ETAPA 1: ABRIR ENVELOPE ---
    envelopeBlock.addEventListener("click", () => {
        if (envelopeAberto) return;
        envelopeAberto = true;

        envelopeBlock.classList.add("open");

        // Toca a primeira música (triste/calma)
        sndMusica.volume = parseFloat(volumeSlider.value);
        sndMusica.play().catch(() => {});

        setTimeout(() => {
            mainCard.style.display = "block";
            setTimeout(() => {
                mainCard.classList.add("show");
                digitarTextoCard();
                mainCard.scrollIntoView({ behavior: 'smooth' });
            }, 50);
        }, 2500);
    });

    let indexTexto = 0;
    function digitarTextoCard() {
        if (indexTexto < textoMensagemCard.length) {
            message.innerHTML += textoMensagemCard.charAt(indexTexto);
            indexTexto++;
            setTimeout(digitarTextoCard, 40);
        }
    }

    // Controle de volume unificado (controla as duas músicas)
    volumeSlider.addEventListener("input", (e) => {
        const vol = parseFloat(e.target.value);
        sndMusica.volume = vol;
        sndMusicaFeliz.volume = vol;
        volumeIcon.innerText = vol === 0 ? "🔇" : vol < 0.5 ? "🔉" : "🔊";
    });

    // --- BOTÃO NÃO FUGIR ---
    function fugirBotaoNao(e) {
        if (aceitou) return;
        if (e) e.preventDefault();

        sndErro.currentTime = 0;
        sndErro.play().catch(() => {});

        if (!btnNao.classList.contains("absolute")) {
            btnNao.classList.add("absolute");
        }
        
        const margem = 60;
        const maxX = window.innerWidth - btnNao.offsetWidth - margem;
        const maxY = window.innerHeight - btnNao.offsetHeight - margem;
        
        const randomX = Math.max(margem, Math.floor(Math.random() * maxX));
        const randomY = Math.max(margem, Math.floor(Math.random() * maxY));
        
        btnNao.style.left = `${randomX}px`;
        btnNao.style.top = `${randomY}px`;

        escalaSim += 0.5;
        if (escalaSim < 3.5) {
            btnSim.style.transform = `scale(${escalaSim})`;
        } else {
            btnSim.classList.add("fullscreen");
            btnSim.style.transform = "none";
            btnNao.style.display = "none";
        }
    }

    btnNao.addEventListener("touchstart", fugirBotaoNao);
    btnNao.addEventListener("mouseover", fugirBotaoNao);
    btnNao.addEventListener("click", fugirBotaoNao);

    // --- ETAPA 2: CLIQUE NO SIM (MUDANÇA DE MÚSICA + POPUP MÁGICO) ---
    btnSim.addEventListener("click", () => {
        if (aceitou) return;
        aceitou = true;

        if (navigator.vibrate) {
            navigator.vibrate([150, 100, 200]);
        }

        // Para a música triste inicial
        sndMusica.pause();

        // Toca a nova música alegre do SIM
        sndMusicaFeliz.volume = parseFloat(volumeSlider.value);
        sndMusicaFeliz.play().catch(() => {});

        // Toca miado fofo de gatinho
        sndGato.currentTime = 0;
        sndGato.play().catch(() => {});

        rainContainer.style.opacity = "0";
        setTimeout(() => rainContainer.innerHTML = "", 1000);

        envelopeBlock.style.opacity = "0";
        setTimeout(() => envelopeBlock.style.display = "none", 1000);

        btnSim.classList.remove("fullscreen");
        btnSim.style.transform = "scale(1)";
        btnSim.style.display = "inline-block";
        btnSim.innerText = "Prometo cuidar de você! 💕";
        btnSim.disabled = true;

        document.body.classList.add("success-bg");
        
        // Ative a troca da foto alterando o nome do arquivo aqui:
        catImg.src = "happy-cat.png"; 
        
        document.querySelector(".polaroid").style.transform = "rotate(4deg) scale(1.02)";
        document.getElementById("polaroid-text").innerText = "Obrigado por não desistir de nós! 💕";

        title.innerHTML = "Obrigado! 💖";
        message.innerHTML = "Fico muito feliz que tenha lido e aceitado.";
        question.style.display = "none";
        btnNao.style.display = "none";

        document.body.classList.add("modal-blur");
        loveModal.classList.add("show");

        // SURPRESA: Digitação gradual na segunda carta também para ficar lindo!
        setTimeout(() => {
            let idxFinal = 0;
            function digitarCartaFinal() {
                if (idxFinal < textoOriginalCartaFinal.length) {
                    finalLetterText.innerHTML += textoOriginalCartaFinal.charAt(idxFinal);
                    idxFinal++;
                    setTimeout(digitarCartaFinal, 30);
                }
            }
            digitarCartaFinal();
        }, 1500);

        lancarFestaParticulas();
    });

    // --- ETAPA 3: CLIQUE NO "X" ---
    btnCloseModal.addEventListener("click", () => {
        document.body.classList.remove("modal-blur");
        loveModal.classList.remove("show");
        mainCard.scrollIntoView({ behavior: 'smooth' });
    });

    // --- ANIMAÇÃO DE FESTA EXPANDIDA ---
    function lancarFestaParticulas() {
        const total = 90;
        const itens = ["❤️", "💖", "🔥", "🌹", "🌸", "✨", "🐱", "🎈"];

        for (let i = 0; i < total; i++) {
            setTimeout(() => {
                const particula = document.createElement("div");
                particula.classList.add("mix-particle");
                particula.innerText = itens[Math.floor(Math.random() * itens.length)];
                particula.style.left = Math.random() * 100 + "vw";
                
                const desvioX = (Math.random() * 300 - 150) + "px";
                const rotacao = (Math.random() * 360) + "deg";
                const tamanhoAleatorio = (Math.random() * 0.7 + 1.1); 
                
                particula.style.setProperty('--random-x', desvioX);
                particula.style.setProperty('--random-deg', rotacao);
                particula.style.setProperty('--random-scale', tamanhoAleatorio);
                
                particula.style.animationDuration = (Math.random() * 1.6 + 1.4) + "s";
                document.body.appendChild(particula);

                particula.addEventListener("animationend", () => particula.remove());
            }, i * 35);
        }
    }
});