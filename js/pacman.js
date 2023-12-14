class Pacman{
    constructor(x, y, width, height, speed){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.Arah = Kanan;
        this.nextArah = this.Arah;
        this.currentFrame = 1;
        this.jml_frame = 7; //animation gif

        setInterval(() => {
            this.ubahAnimasi();
        }, 100);
    }

    ubahAnimasi(){
        this.currentFrame = 
            this.currentFrame == this.jml_frame ? 1 : this.currentFrame + 1;
    }

    draw(){
        canvasContext.save();
        canvasContext.translate(
            this.x + Block/2,
            this.y + Block/2
        );
        canvasContext.rotate((this.Arah * 90 * Math.PI) / 180);
        canvasContext.translate(
            -this.x - Block/2,
            -this.y - Block/2
        );
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame-1) * Block,
            0, 
            Block, 
            Block, 
            this.x, 
            this.y, 
            this.width,
            this.height
        );
        canvasContext.restore();
    }

    gerak(){
        this.cekArahJikaBisa();
        this.gerakMaju();
        if (this.cekCrash()){
            this.gerakMundur();
        }
    }

    gerakMundur(){
        switch(this.Arah){
            case Kanan:
                this.x -= this.speed;
                break;
            case Atas:
                this.y += this.speed;
                break;
            case Kiri:
                this.x += this.speed;
                break;
            case Bawah:
                this.y -= this.speed;
                break;
        }
    }

    gerakMaju(){
        switch(this.Arah){
            case Kanan:
                this.x += this.speed;
                break;
            case Atas:
                this.y -= this.speed;
                break;
            case Kiri:
                this.x -= this.speed;
                break;
            case Bawah:
                this.y += this.speed;
                break;
        }
    }

    cekCrash(){ //buat gerakan pacmannya, biar ga ngelewatin batas wall
        let Crash = false
        if(
            map[parseInt(this.y / Block)][
                parseInt(this.x / Block)
            ] == 1 ||
            map[parseInt(this.y / Block + 0.9999)][
                parseInt(this.x / Block)
            ] == 1 ||
            map[parseInt(this.y / Block)][
                parseInt(this.x / Block + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / Block + 0.9999)][
                parseInt(this.x / Block + 0.9999)
            ] == 1
        ) {
            Crash = true;
        }
        return Crash;
    }

    cekGhostCrash(){ //cek kena ghostnya
        for(let i=0; i<hantu.length; i++){
            let ghost = hantu[i];
            if(
                ghost.getMapX()==this.getMapX() && 
                ghost.getMapY()==this.getMapY()
            ){
                return true;
            }
        }
        return false;
    }

    cekArahJikaBisa(){  //cek jalan pacman
        if (this.Arah == this.nextArah) return;
        let tempArah = this.Arah;
        this.Arah = this.nextArah;
        this.gerakMaju();
        if(this.cekCrash()){
            this.gerakMundur();
            this.Arah = tempArah;
        }
        else{
            this.gerakMundur();
        }
    }

    getMapX(){
        return parseInt(this.x / Block);
    }

    getMapY(){
        return parseInt(this.y / Block);
    }

    getMapXRightSide(){
        return parseInt((this.x + 0.999 * Block) / Block);
    }

    getMapYRightSide(){
        return parseInt((this.y + 0.999 * Block) / Block);
    }

    eat(){
        for (let i = 0; i < map.length; i++){
            for (let j=0; j < map[0].length;j++){
                if(
                    map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ){
                    var audio = new Audio('./../FP-Pacman/audio/eating.short.mp3');
                    audio.playbackRate = 2;
                    audio.play();
                    map[i][j] = 3;
                    skor++;
                }
            }
        }
    }
}