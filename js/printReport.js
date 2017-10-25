class printReport {
    constructor(report){
        this.report = report;

        this.content = [
            { text: `Tarkkailuraportti`, fontSize: 20 },
            { text: `${report.title()}`, fontSize: 15 },
        ];

        this.content = [this.content, ...this.ottelunTiedot()];
        this.content = [this.content, ...this.lopullinenTuomariarvio()];
        this.content = [this.content, ...this.arvosanojenSelitteet()];

        this.dd = {
            content: this.content,
            styles: this.styles(),
        }
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
        }
    }

}

