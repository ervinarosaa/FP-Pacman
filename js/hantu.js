class Ghost {
    constructor(
        x,
        y, 
        width, 
        height, 
        speed,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        range
    ){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.Arah = Kanan;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.targetRandom_index = parseInt(
            Math.random() * 4 //angka acak dari 0 dan 1, *4 utk 4 hantu
        );
        setInterval(() => {
            this.ubahArahRandom()
        }, 4000);
    }

    ubahArahRandom(){
        this.targetRandom_index += 1; 
        this.targetRandom_index = this.targetRandom_index % 4; //modulus
    }

    gerak(){
        if(this.dekatPacman()){
            this.target = pacman;
        } else{
            this.target = targetRandom_hantu[this.targetRandom_index];
        }
        this.ubahArahJikaBisa();
        this.gerakMaju();
        if (this.cekCrash()){
            this.gerakMundur();
            return;
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

    cekCrash(){
        let Crash = false
        if (
            map[parseInt(this.y / Block)][
                parseInt(this.x / Block)
            ] == 1 ||
            map[parseInt(this.y / Block + 0.999)][
                parseInt(this.x / Block)
            ] == 1 ||
            map[parseInt(this.y / Block)][
                parseInt(this.x / Block + 0.999)
            ] == 1 ||
            map[parseInt(this.y / Block + 0.999)][
                parseInt(this.x / Block + 0.999)
            ] == 1
        ) {
            Crash = true;
        }
        return Crash;
    }

    dekatPacman() {
        let Jarak_x = Math.abs(pacman.getMapX() - this.getMapX());
        let Jarak_y = Math.abs(pacman.getMapY() - this.getMapY());
        if(
            Math.sqrt(Jarak_x * Jarak_x + Jarak_y* Jarak_y) <=
            this.range
        ){
            return true;
        }
        return false;
    }

    ubahArahJikaBisa(){
        let tempArah = this.Arah;

        this.Arah = this.arahBaru(
            map,
            parseInt(this.target.x / Block),
            parseInt(this.target.y / Block)
        );

        if(typeof this.Arah == "undenfined"){
            this.Arah = tempArah;
            return;
        }

        if (
            this.getMapY() != this.getMapYRightSide() &&
            (this.Arah == Kiri ||
                this.Arah == Kanan)
        ) {
            this.Arah = Atas;
        }
        if (
            this.getMapX() != this.getMapXRightSide() &&
            (this.Arah == Atas ||
                this.Arah == Bawah)
        ) {
            this.Arah = Kiri;
        }

        this.gerakMaju();
        if(this.cekCrash()){
            this.gerakMundur();
            this.Arah = tempArah;
        }
        else{
            this.gerakMundur();
        }
        console.log(this.Arah);
    }

    arahBaru(map, destX, destY) {
        let mp = [];
        for (let i=0; i<map.length; i++){
            mp[i] = map[i].slice();
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];

        while(queue.length > 0){
            let jarak = queue.shift();
            if(jarak.x == destX && jarak.y == destY){
                return jarak.moves[0];
            } else{
                mp[jarak.y][jarak.x] =1
                let daftarJarakTerpendek = this.jarakTerpendek(jarak, mp);
                for (let i=0; i<daftarJarakTerpendek.length; i++){
                    queue.push(daftarJarakTerpendek[i]);
                }
            }
        }

        return Atas; //default
    }

    jarakTerpendek(jarak, mp){ //algoritma jarak terpendek
        let queue= [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if( //kiri
            jarak.x -1 >= 0 && 
            jarak.x -1 < numOfRows && 
            mp[jarak.y][jarak.x -1] != 1
        ) {
            let tempMoves = jarak.moves.slice();
            tempMoves.push(Kiri);
            queue.push({ x: jarak.x-1, y:jarak.y, moves: tempMoves});
        }
        if( //kanan
            jarak.x +1 >= 0 && 
            jarak.x +1 < numOfRows && 
            mp[jarak.y][jarak.x +1] != 1
        ) {
            let tempMoves = jarak.moves.slice();
            tempMoves.push(Kanan);
            queue.push({ x: jarak.x+1, y:jarak.y, moves: tempMoves});
        }
        if(//atas
            jarak.y +1 >= 0 && 
            jarak.y +1 < numOfColumns && 
            mp[jarak.y -1][jarak.x] != 1
        ) {
            let tempMoves = jarak.moves.slice();
            tempMoves.push(Atas);
            queue.push({ x: jarak.x, y:jarak.y-1, moves: tempMoves});
        }
        if(//bawah
            jarak.y -1 >= 0 && 
            jarak.y -1 < numOfColumns && 
            mp[jarak.y +1][jarak.x] != 1
        ) {
            let tempMoves = jarak.moves.slice();
            tempMoves.push(Bawah);
            queue.push({ x: jarak.x, y:jarak.y+1, moves: tempMoves});
        }

        return queue;
    }

    draw(){
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x, 
            this.y, 
            this.width,
            this.height
        );
        canvasContext.restore();
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
};