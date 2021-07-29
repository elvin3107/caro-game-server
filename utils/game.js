module.exports = {
    calculateElo: (winnerElo, loserElo, type) => {
        getK= (elo) => {
            if(elo < 1600) return 25;
            if(elo < 2000) return 20;
            if(elo < 2400) return 15;
            return 10;
        }

        const Rw = winnerElo;
        const Rl = loserElo;
        const Qw = 10 ** (Rw / 400);
        const Ql = 10 ** (Rl / 400);
        const Ew = Qw / (Qw + Ql);
        const El = Ql / (Qw + Ql);
        const Kw = getK(Rw);
        const Kl = getK(Rl);
        let Aw = 0.5;
        let Al = 0.5;
        
        if(type === "winLose") {
            Aw = 1;
            Al = 0;
        }
        
        return {
            winnerElo: Math.ceil(Rw + Kw * (Aw - Ew)),
            loserElo: Math.ceil(Rl + Kl * (Al - El))
        }
    },
    getRank: (elo) => {
        if(elo < 1200) return "Tập sự";
        if(elo < 1400) return "Phong trào 1";
        if(elo < 1600) return "Phong trào 2";
        if(elo < 1800) return "Kỳ thủ 1";
        if(elo < 2000) return "Kỳ thủ 2";
        if(elo < 2200) return "Kỳ sỹ 1";
        if(elo < 2400) return "Kỳ sỹ 2";
        return "Kỳ vương";
    }
}