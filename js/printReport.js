function n(val){
    if(val == null || typeof(val) === 'undefined') return "";
    return val;
}
class printReport {
    constructor(report){
        this.initImages();
        this.report = report;

        this.content = [
            { text: `Tarkkailuraportti`, fontSize: 20 },
            { text: `${report.title()}`, fontSize: 15 },
        ];

        for(let o of this.ottelunTiedot()) this.content.push(o);
        this.content.push({text: " ", marginTop: 30 });
        for(let o of this.lopullinenTuomariarvio()) this.content.push(o);
        
        for(let o of this.tuomariOtsikko("PT")) this.content.push(o);
        for(let o of this.arvosanojenSelitteet()) this.content.push(o);
        for(let o of this.osio("Tuomaritekniikka ja suoritustaito - PT", [report.rivit[0], report.rivit[1], report.rivit[2], report.rivit[3], report.rivit[4],], true)) this.content.push(o);
        for(let o of this.osio("Sääntöjen sekä ohjeiden ja tulkintojen soveltaminen - PT", [report.rivit[5], report.rivit[6], report.rivit[7], report.rivit[8], report.rivit[9],])) this.content.push(o);
        for(let o of this.osio("Vuorovaikutus joukkueiden kanssa - PT", [report.rivit[10], report.rivit[11], report.rivit[12]])) this.content.push(o);
        for(let o of this.osio("Ottelun johtaminen ja persoonallisuus - PT", [report.rivit[13], report.rivit[14], report.rivit[15], report.rivit[16]])) this.content.push(o);

        for(let o of this.tuomariOtsikko("VT")) this.content.push(o);
        for(let o of this.arvosanojenSelitteet()) this.content.push(o);
        for(let o of this.osio("Tuomaritekniikka ja suoritustaito - VT", [report.rivit[17], report.rivit[18], report.rivit[19], report.rivit[20], report.rivit[21], report.rivit[22]], true)) this.content.push(o);
        for(let o of this.osio("x - VT", [report.rivit[23], report.rivit[24], report.rivit[25], report.rivit[26], report.rivit[27],])) this.content.push(o);
        for(let o of this.osio("Vuorovaikutus joukkueiden kanssa - VT", [report.rivit[28], report.rivit[29]])) this.content.push(o);
        for(let o of this.osio("Ottelun johtaminen ja persoonallisuus - VT", [report.rivit[30], report.rivit[31], report.rivit[32], report.rivit[33]])) this.content.push(o);

        this.dd = {
            content: this.content,
            styles: this.styles(),
        }
    }

    initImages(){
        this.IMAGE_DARK_GREY = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTczbp9jAAAADElEQVQYV2Owt7cHAAF+AL6Nd+jYAAAAAElFTkSuQmCC";
        this.IMAGE_BLACK     = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTczbp9jAAAADElEQVQYV2NgYGAAAAAEAAFczf9pAAAAAElFTkSuQmCC";
        this.IMAGE_BLUE      = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTczbp9jAAAADElEQVQYV2NgUv0DAAFQASQSuMo0AAAAAElFTkSuQmCC";
        this.IMAGE_GREEN     = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTczbp9jAAAADElEQVQYV2Pw/sMEAALfAUqSQCtyAAAAAElFTkSuQmCC";
        this.IMAGE_GREY      = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTczbp9jAAAADElEQVQYV2Oor68HAAL+AX4Q/7cZAAAAAElFTkSuQmCC";
        this.IMAGE_RED       = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTczbp9jAAAADElEQVQYV2P4z8AAAAMBAQBjJFXTAAAAAElFTkSuQmCC";
    }

    ottelunTiedot(){
        let report = this.report;
        
        let vaikeus = "Normaali";
        switch(report.vaikeus){
            case NORMAALI:
                vaikeus = "Normaali";   
                break;
            case VAIKEA:
                vaikeus = "Vaikea";   
                break;
            case HELPPO:
                vaikeus = "Helppo";   
                break;
        }

        let ret =  [

            { columns: [
                { width: 100, text: "Pvm:", style: 'bold', },
                { width: 400, text: moment(report.pvm).format("DD.MM.YYYY"), style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Paikka:", style: 'bold', },
                { width: 400, text: report.paikka, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Ottelu:", style: 'bold', },
                { width: 400, text: `${report.koti}-${report.vieras}`, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Tulos:", style: 'bold', },
                { width: 400, text: report.tulos, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Kesto:", style: 'bold', },
                { width: 400, text: `${report.kesto_h} h ${report.kesto_min} min`, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Vaikeusaste:", style: 'bold', },
                { width: 400, text: vaikeus, style: 'normal', }
            ]},
            " ",
            { columns: [
                { width: 100, text: "Päätuomari:", style: 'bold', },
                { width: 400, text: report.pt_nimi, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Verkkotuomari:", style: 'bold', },
                { width: 400, text: report.vt_nimi, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Tarkkailija:", style: 'bold', },
                { width: 400, text: report.tark_nimi, style: 'normal', }
            ]},
        ];

        return this.makeSection("Ottelun tiedot", ret);
    }

    lopullinenTuomariarvio(){
        let raportti = this.report;
        let pt_sana = "xxx";
        if(raportti.pt_score >= 97) pt_sana = "Erinomainen";
        if(raportti.pt_score >= 90 && raportti.pt_score < 97) pt_sana = "Erittäin hyvä";
        if(raportti.pt_score >= 75 && raportti.pt_score < 90) pt_sana = "Hyvä";
        if(raportti.pt_score >= 60 && raportti.pt_score < 75) pt_sana = "Välttävä";
        if(raportti.pt_score < 60) pt_sana = "Huono";

        let vt_sana = "xxx";
        if(raportti.vt_score >= 97) vt_sana = "Erinomainen";
        if(raportti.vt_score >= 90 && raportti.vt_score < 97) vt_sana = "Erittäin hyvä";
        if(raportti.vt_score >= 75 && raportti.vt_score < 90) vt_sana = "Hyvä";
        if(raportti.vt_score >= 60 && raportti.vt_score < 75) vt_sana = "Välttävä";
        if(raportti.vt_score < 60) vt_sana = "Huono";
        
        let ret = [
            { columns: [
                { width: 100, text: " ", style: ['bold', 'left'] },
                { width: 200, text: "Päätuomari " + raportti.pt_nimi, style: ['bold', 'center'], marginLeft: 9  },
                { width: 200, text: "Verkkotuomari " + raportti.vt_nimi, style: ['bold', 'center'], marginLeft: 9  },
            ]},
            { columns: [
                { width: 100, text: "Pisteet", style: ['bold', 'left'], marginTop: 7 },
                { width: 200, text: raportti.pt_score, style: ['normal', 'center'], marginLeft: 9, marginTop: 7 },
                { width: 200, text: raportti.vt_score, style: ['normal', 'center'], marginLeft: 9, marginTop: 7 },
            ]},
            { columns: [
                { width: 100, text: "Lopullinen tulos", style: ['bold', 'left'], marginTop: 7 },
                { width: 200, text: pt_sana, style: ['normal', 'center'], marginLeft: 9, marginTop: 7 },
                { width: 200, text: vt_sana, style: ['normal', 'center'], marginLeft: 9, marginTop: 7 },
            ]},
            { columns: [
                { width: 100, text: "Kehityssuositukset ja huomautukset", style: ['bold', 'left'], marginTop: 7 },
                { width: 200, text: raportti.pt_huom, style: ['normal', 'left'], marginLeft: 9, marginTop: 7},
                { width: 200, text: raportti.vt_huom, style: ['normal', 'left'], marginLeft: 9, marginTop: 7},
            ]},
            { columns: [
                { width: 100, text: "Muita huomioita", style: ['bold', 'left'], marginTop: 7 },
                { width: 400, text: raportti.raportti_huom, style: ['normal', 'left'], marginLeft: 9, marginTop: 7},
            ]},
            
        ];

        return this.makeSection("Lopullinen tuomariarvio", ret);
    }

    tuomariOtsikko(pt_tai_vt){
        let raportti = this.report;
        let tuomari = "";
        if(pt_tai_vt == 'PT'){
            return [{ 
                text: [ 
                    { text: `Päätuomari ${this.report.pt_nimi}`, style: 'h1'},
                    '          ',
                    { text: `Pisteet: ${this.report.pt_score}`, style: 'h3',} 
                ],
                pageBreak: 'before',
            }];
        } else {
            return [{ 
                text: [ 
                    { text: `Verkkotuomari ${this.report.vt_nimi}`, style: 'h1'},
                    '          ',
                    { text: `Pisteet: ${this.report.vt_score}`, style: 'h3',} 
                ],
                pageBreak: 'before',
            }];
        }
    }

    makeSection(title, content){
        let ret = [
            { 
                margin: [0, 20, 0, 0],
                table: {
                    headerRows: 1,
                    keepWithHeaderRows: 2,
                    dontBreakRows: true,
                    body: [
                        [ { text: title, style: 'bold'} ],
                        [   content   ],
                    ]
                }
            },
        ];
        return ret;
    }

    arvosanojenSelitteet(){
        return this.makeSection("Arvosanojen selitteet", this.arvosanojenSelitteet2());
    }

    arvosanojenSelitteet2(){
        return [
            { columns: [
                { width: 25, text: "a:", style: ['bold', 'left'] },
                { width: '*', text: "Erinomainen, esimerkillinen", style: ['normal', 'left'] },
                { width: 25, text: "d:", style: ['bold', 'left'] },
                { width: '*', text: "Useampia parannettavia asioita suoritettava", style: ['normal', 'left'] },
            ]},
            { columns: [
                { width: 25, text: "b:", style: ['bold', 'left'] },
                { width: '*', text: "Ei parannettavaa", style: ['normal', 'left'] },
                { width: 25, text: "e:", style: ['bold', 'left'] },
                { width: '*', text: "Alle keskiarvon, huomattavia parannettavia asioita suoritettava", style: ['normal', 'left'] },
            ]},
            { columns: [
                { width: 25, text: "c:", style: ['bold', 'left'] },
                { width: '*', text: "Vähäisiä parannettavia asioita suoritettava", style: ['normal', 'left'] },
                { width: 25, text: "f:", style: ['bold', 'left'] },
                { width: '*', text: "Perusasioissa tarve huomattaviin parannuksiin", style: ['normal', 'left'], },
            ]},
            
        ];
    }

    abcedf(letters="abcdef"){
        if(letters == 1) letters = 'a';
        if(letters == 2) letters = 'b';
        if(letters == 3) letters = 'c';
        if(letters == 4) letters = 'd';
        if(letters == 5) letters = 'e';
        if(letters == 6) letters = 'f';
        let a = letters.indexOf('a') >= 0 ? 'a' : '';
        let b = letters.indexOf('b') >= 0 ? 'b' : '';
        let c = letters.indexOf('c') >= 0 ? 'c' : '';
        let d = letters.indexOf('d') >= 0 ? 'd' : '';
        let e = letters.indexOf('e') >= 0 ? 'e' : '';
        let f = letters.indexOf('f') >= 0 ? 'f' : '';
        return {
            table: {
                widths: [5, 5, 5, 5, 5, 5],
                body: [[{ text: a, style: 'normal' },
                        { text: b, style: 'normal' },
                        { text: c, style: 'normal' },
                        { text: d, style: 'normal' },
                        { text: e, style: 'normal' },
                        { text: f, style: 'normal' },
            ]]
            },
        };           
    }

    rivi(rivi){
        let self = this;
        let no = n(rivi.aihe_no);
        if(no.length > 2) no = no.substring(1);
        if(no.length > 1 && no[0] == '0') no = no.substring(1);
        return {
            table: {
                widths: [14, 170, 90, 210],
                dontBreakRows: true,
                body: [
                    [
                        { text: no, style: 'bold' }, 
                        { text: [{ text: n(rivi.otsikko), style: 'bold' }, {text: "\n" + n(rivi.teksti), style: 'normal' } ] },
                        self.abcedf(rivi.arvosana), 
                        { text: n(rivi.huom), style: 'normal' }
                    ],
                ],
            },
            layout: 'noBorders',
        };           
    }
            
           
    osio(name, rivit, selite=false){
        let r = [];
        if(selite){
            r.push(this.rivi({ arvosana: 'abcdef'}));
        }
        for(let rivi of rivit) r.push(this.rivi(rivi));

        let ret = this.makeSection(name, r);
        return ret;
    }

    pdf(){
        let name = `${this.report.pvm} ${this.report.koti}-${this.report.vieras} ${this.report.pt_nimi}-${this.report.vt_nimi}-${this.report.tark_nimi}.pdf`
        pdfMake.createPdf(this.dd).download(name);
    }

    
    styles(){
        return {
            h3: {
                fontSize: 12,
                marginBottom: 5,
                marginTop: 10,
            },
            h1: {
                fontSize: 15,
                marginBottom: 5,
                marginTop: 10,
            },
            bold: {
                fontSize: 10,
                bold: true,
            },
            normal: {
                fontSize: 10,
                bold: false,
            },
            left: {
                alignment: 'left',
            },
            center: {
                alignment: 'center',
            },
            smaller: {
                fontSize: 8,
            },
        }
    }

}

