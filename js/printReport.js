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
        for(let o of this.lopullinenTuomariarvio()) this.content.push(o);
        for(let o of this.arvosanojenSelitteet()) this.content.push(o);
        for(let o of this.osio("Eka", [report.rivit[3], report.rivit[4], ])) this.content.push(o);
        //this.content = [this.content, ...this.rivi(report.rivit[0])];
        //this.content = [this.content, ...this.rivi(report.rivit[1])];

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
        return [

            { text: `Ottelun tiedot`, style: 'h3', },
            { columns: [
                { width: 100, text: "Pvm:", style: 'bold', },
                { width: '*', text: report.pvm, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Paikka:", style: 'bold', },
                { width: '*', text: report.paikka, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Ottelu:", style: 'bold', },
                { width: '*', text: `${report.koti}-${report.vieras}`, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Tulos:", style: 'bold', },
                { width: '*', text: report.tulos, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Kesto:", style: 'bold', },
                { width: '*', text: `${report.kesto_h} h ${report.kesto_min} min`, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Vaikeusaste:", style: 'bold', },
                { width: '*', text: report.vaikeus, style: 'normal', }
            ]},
            " ",
            { columns: [
                { width: 100, text: "Päätuomari:", style: 'bold', },
                { width: '*', text: report.pt_nimi, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Verkkotuomari:", style: 'bold', },
                { width: '*', text: report.vt_nimi, style: 'normal', }
            ]},
            { columns: [
                { width: 100, text: "Tarkkailija:", style: 'bold', },
                { width: '*', text: report.tark_nimi, style: 'normal', }
            ]},
            
        ];
    }

    lopullinenTuomariarvio(){
        let raportti = this.report;
        return [

            { text: `Lopullinen tuomariarvio`, style: 'h3', marginTop: 30,},
            { columns: [
                { width: 100, text: " ", style: ['normal', 'left'] },
                { width: '*', text: "Päätuomari", style: ['normal', 'center'] },
                { width: '*', text: "Verkkotuomari", style: ['normal', 'center'] },
            ]},
            { columns: [
                { width: 100, text: "Pisteet", style: ['normal', 'left'] },
                { width: '*', text: raportti.pt_score, style: ['normal', 'center'] },
                { width: '*', text: raportti.vt_score, style: ['normal', 'center'] },
            ]},
            { columns: [
                { width: 100, text: "Lopullinen tulos", style: ['normal', 'left'] },
                { width: '*', text: raportti.pt_score, style: ['normal', 'center'] },
                { width: '*', text: raportti.vt_score, style: ['normal', 'center'] },
            ]},
            { columns: [
                { width: 100, text: "Kehityssuositukset ja huomautukset", style: ['normal', 'left'] },
                { width: '*', text: raportti.pt_huom, style: ['normal', 'left'] },
                { width: '*', text: raportti.vt_huom, style: ['normal', 'left'] },
            ]},
            { columns: [
                { width: 100, text: "Muita huomioita", style: ['normal', 'left'] },
                { width: '*', text: raportti.raportti_huom, style: ['normal', 'left'] },
            ]},
            
        ];
    }

    arvosanojenSelitteet(){
        return [

            { text: `Arvosanojen selitteet`, style: 'h3', marginTop: 50,},
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
                { width: '*', text: "Perusasioissa tarve huomattaviin parannuksiin", style: ['normal', 'left'], pageBreak: 'after', },
            ]},
            
        ];
    }

    rivi(rivi){
        rivi.huom = "Jotain hemmetin pitkää tekstiä Jotain hemmetin pitkää tekstiä Jotain hemmetin pitkää tekstiä Jotain hemmetin pitkää tekstiä Jotain hemmetin pitkää tekstiä ";
        return {
            table: {
                widths: [14, 160, 50, 'auto'],
                body: [
                    [
                        n(rivi.aihe_no), 
                        n(rivi.otsikko), 
                        "abcdef",
                        {rowSpan: 2, text: n(rivi.huom), }
                    ],
                    [
                        '', 
                        n("rivi.teksti"), 
                        '', 
                        '', 
                    ],
                ],
            },
            layout: 'noBorders',
        };           
    }
            
           
    osio(name, rivit){
        let r = [];
        for(let rivi of rivit) r.push(this.rivi(rivi));

        let ret = [
            { 
                table: {
                    body: [
                        [ 'name'],
                        [   r   ],
                    ]
                }
            },
        ];
        return ret;
    }

    pdf(){
        pdfMake.createPdf(this.dd).download("testreport.pdf");
    }

    
    styles(){
        return {
            h3: {
                fontSize: 12,
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

